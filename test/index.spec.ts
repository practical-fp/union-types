import { assert, Has, IsExact } from "conditional-type-checks"
import {
    assertNever,
    impl,
    hasTag,
    match,
    Narrow,
    predicate,
    tag,
    Tags,
    Values,
    Variant,
    WILDCARD,
    Impl,
} from "../src"

type IndexSpec = Variant<"Test", number>
type NotTest = Variant<"NotTest">
type Union = IndexSpec | NotTest

assert<IsExact<Tags<Union>, "Test" | "NotTest">>(true)
assert<IsExact<Values<Union>, number | undefined>>(true)
assert<IsExact<Narrow<Union, "Test">, IndexSpec>>(true)

interface ExtendedVariant extends Variant<"Test", number> {
    somethingElse: boolean
}

assert<IsExact<Narrow<ExtendedVariant | NotTest, "Test">, ExtendedVariant>>(true)

const testArray = new Array<Union>().filter(predicate("Test"))
assert<IsExact<typeof testArray, IndexSpec[]>>(true)

const neverArray = new Array<Union>().filter(predicate("SomethingElse"))
assert<IsExact<typeof neverArray, never[]>>(true)

const matchResult = match({} as Union, {
    Test: number => number,
    NotTest: () => undefined,
    [WILDCARD]: () => true,
})
assert<IsExact<typeof matchResult, number | undefined | boolean>>(true)

assert<IsExact<typeof assertNever, (_: never) => never>>(true)

assert<Has<Impl<Variant<"Test", unknown>>["Test"], <T>(value: T) => Variant<"Test", T>>>(true)
assert<Has<Impl<Variant<"Test", number>>["Test"], <T>(value: T) => Variant<"Test", T>>>(false)
assert<Has<Impl<Variant<"Test">>["Test"], () => Variant<"Test">>>(true)

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
    const result = match(tag("Test"), {
        Test: () => true,
        [WILDCARD]: () => false,
    })
    expect(result).toBe(true)
})

test("match should call the wildcard", () => {
    const result = match(tag("Test"), {
        NotTest: () => false,
        [WILDCARD]: () => true,
    })
    expect(result).toBe(true)
})

test("assertNever should throw an error", () => {
    const throws = () => {
        assertNever(undefined as never)
    }
    expect(throws).toThrow(Error)
})

test("impl should construct a tagged value", () => {
    const Union = impl<Variant<"Test", number>>()
    expect(Union.Test(42)).toEqual({ tag: "Test", value: 42 })
})