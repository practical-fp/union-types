import { assert, Has, IsExact } from "conditional-type-checks"
import {
    AnyVariant,
    hasType,
    impl,
    Narrow,
    predicate,
    Types,
    Values,
    variant,
    Variant,
    VariantImpl,
    variantImpl,
} from "../src"

test("Types should extract the type of a variant", () => {
    type Var = Variant<"1">
    type Actual = Types<Var>
    type Expected = "1"
    assert<IsExact<Actual, Expected>>(true)
})

test("Types should extract all tags of a union", () => {
    type Union = Variant<"1"> | Variant<"2">
    type Actual = Types<Union>
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

test("the Constructor function should be unbounded generic", () => {
    type Actual = VariantImpl<"1", unknown>
    type Expected = <T>(value: T) => Variant<"1", T>
    assert<Has<Actual, Expected>>(true)
})

test("the Constructor function should be bounded to number", () => {
    type Actual = VariantImpl<"1", number>
    type Expected = <T extends number>(value: T) => Variant<"1", T>
    assert<Has<Actual, Expected>>(true)
})

test("the Constructor function argument should be optional", () => {
    type Actual = VariantImpl<"1", number | undefined>
    type Expected = <T extends number | undefined>(value: T | void) => Variant<"1", T>
    assert<Has<Actual, Expected>>(true)
})

test("type should type objects", () => {
    const tagged = variant("Test", { number: 42 })
    expect(hasType(tagged, "Test")).toBe(true)
})

test("type should create tagged objects", () => {
    const tagged = variant("Test")
    expect(hasType(tagged, "Test")).toBe(true)
})

test("hasType should test whether a tagged object has a certain type", () => {
    const tagged = variant("Test")
    expect(hasType(tagged, "Test")).toBe(true)
    expect(hasType(tagged as AnyVariant, "NotTest")).toBe(false)
})

test("predicate should test whether a tagged object has a certain type", () => {
    const isTest = predicate("Test")
    const isNotTest = predicate("NotTest")
    const tagged = variant("Test")
    expect(isTest(tagged)).toBe(true)
    expect(isNotTest(tagged)).toBe(false)
})

test("constructor should construct a tagged value", () => {
    type Union = Variant<"1", number> | Variant<"2">
    const ctor = variantImpl<Union, "1">("1")
    expect(ctor(42)).toEqual({ type: "1", value: 42 })
})

test("impl should construct a tagged value", () => {
    type Union = Variant<"1", number> | Variant<"2">
    const Union = impl<Union>()
    expect(Union[1](42)).toEqual({ type: "1", value: 42 })
})

test("impl should construct an empty tagged value", () => {
    type Union = Variant<"1", number> | Variant<"2">
    const Union = impl<Union>()
    expect(Union[2]()).toEqual({ type: "2", value: undefined })
})
