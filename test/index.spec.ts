import { assert, IsExact } from "conditional-type-checks"
import {
    assertNever,
    constructor,
    Constructor,
    hasTag,
    impl,
    match,
    matchExhaustive,
    matchWildcard,
    Narrow,
    predicate,
    tag,
    Tags,
    Values,
    Variant,
    WILDCARD,
} from "../src"

test("Tags should extract the tag of a variant", () => {
    type Var = Variant<"1">
    type Actual = Tags<Var>
    type Expected = "1"
    assert<IsExact<Actual, Expected>>(true)
})

test("Tags should extract all tags of a union", () => {
    type Union = Variant<"1"> | Variant<"2">
    type Actual = Tags<Union>
    type Expected = "1" | "2"
    assert<IsExact<Actual, Expected>>(true)
})

test("Values should extract the value of a variant", () => {
    type Var = Variant<"1", number>
    type Actual = Values<Var>
    type Expected = number
    assert<IsExact<Actual, Expected>>(true)
})

test("Values should extract all values of a union", () => {
    type Union = Variant<"1", number> | Variant<"2">

    type Actual = Values<Union>
    type Expected = number | undefined
    assert<IsExact<Actual, Expected>>(true)
})

test("Narrow should narrow a union down to a single Variant", () => {
    type Var1 = Variant<"1", number>
    type Var2 = Variant<"2", string>
    type Union = Var1 | Var2

    type Actual = Narrow<Union, "1">
    type Expected = Var1
    assert<IsExact<Actual, Expected>>(true)
})

test("Narrow should work with extended Variants", () => {
    interface Var1 extends Variant<"1", number> {
        someProp: boolean
    }

    type Var2 = Variant<"2", string>
    type Union = Var1 | Var2

    type Actual = Narrow<Union, "1">
    type Expected = Var1
    assert<IsExact<Actual, Expected>>(true)
})

test("predicate should be a type guard", () => {
    type Var1 = Variant<"1", number>
    type Var2 = Variant<"2", string>
    type Union = Var1 | Var2

    const result = new Array<Union>().filter(predicate("1"))

    type Actual = typeof result
    type Expected = Var1[]
    assert<IsExact<Actual, Expected>>(true)
})

test("predicate should work with unrelated tags", () => {
    type Var1 = Variant<"1", number>
    type Var2 = Variant<"2", string>
    type Union = Var1 | Var2

    const result = new Array<Union>().filter(predicate("Unrelated"))

    type Actual = typeof result
    type Expected = never[]
    assert<IsExact<Actual, Expected>>(true)
})

test("match should infer the return value", () => {
    type Union = Variant<"1", number> | Variant<"2">

    const result = match({} as Union, {
        1: number => number,
        2: () => undefined,
        [WILDCARD]: () => true,
    })

    type Actual = typeof result
    type Expected = number | undefined | boolean
    assert<IsExact<Actual, Expected>>(true)
})

test("the Constructor function should be unbounded generic", () => {
    type Actual = Constructor<"1", unknown>
    type Expected = <T>(value: T) => Variant<"1", T>
    assert<IsExact<Actual, Expected>>(true)
})

test("the Constructor function should be bounded to number", () => {
    type Actual = Constructor<"1", number>
    type Expected = <T extends number>(value: T) => Variant<"1", T>
    assert<IsExact<Actual, Expected>>(true)
})

test("the Constructor function argument should be optional", () => {
    type Actual = Constructor<"1", number | undefined>
    type Expected = <T extends number | undefined>(value: T | void) => Variant<"1", T>
    assert<IsExact<Actual, Expected>>(true)
})

test("tag should tag objects", () => {
    const tagged = tag("Test", { number: 42 })
    expect(hasTag(tagged, "Test")).toBe(true)
})

test("tag should create tagged objects", () => {
    const tagged = tag("Test")
    expect(hasTag(tagged, "Test")).toBe(true)
})

test("hasTag should test whether a tagged object has a certain tag", () => {
    const tagged = tag("Test")
    expect(hasTag(tagged, "Test")).toBe(true)
    expect(hasTag<Variant, string>(tagged, "NotTest")).toBe(false)
})

test("predicate should test whether a tagged object has a certain tag", () => {
    const isTest = predicate("Test")
    const isNotTest = predicate("NotTest")
    const tagged = tag("Test")
    expect(isTest(tagged)).toBe(true)
    expect(isNotTest(tagged)).toBe(false)
})

test("match should call the matching handler", () => {
    const result = matchWildcard(tag("Test"), {
        Test: () => true,
        [WILDCARD]: () => false,
    })
    expect(result).toBe(true)
})

test("match should call the wildcard", () => {
    const result = matchWildcard(tag("Test"), {
        [WILDCARD]: () => true,
    })
    expect(result).toBe(true)
})

test("match should throw an error when an unexpected tag is encountered", () => {
    const throws = () => {
        matchExhaustive(tag("Test"), {} as any)
    }
    expect(throws).toThrow(Error)
})

test("assertNever should throw an error", () => {
    const throws = () => {
        assertNever(undefined as never)
    }
    expect(throws).toThrow(Error)
})

test("constructor should construct a tagged value", () => {
    type Union = Variant<"1", number> | Variant<"2">
    const ctor = constructor<Union, "1">("1")
    expect(ctor(42)).toEqual({ tag: "1", value: 42 })
})

test("impl should construct a tagged value", () => {
    type Union = Variant<"1", number> | Variant<"2">
    const Union = impl<Union>()
    expect(Union[1](42)).toEqual({ tag: "1", value: 42 })
})

test("impl should construct an empty tagged value", () => {
    type Union = Variant<"1", number> | Variant<"2">
    const Union = impl<Union>()
    expect(Union[2]()).toEqual({ tag: "2", value: undefined })
})
