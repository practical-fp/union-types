import { implFactory, Variant } from "../src"
import { assert, IsExact } from "conditional-type-checks"

describe("scoped impl", () => {
    type Foo = Variant<"Foo", string>
    type Bar = Variant<"Bar", number>
    type Union = Foo | Bar

    const impl = implFactory({ typeKey: "type", valueKey: "value" })
    const { Foo, Bar } = impl<Union>()

    it("should construct a variant", () => {
        const actual = Foo("Hello, World!")
        expect(actual).toEqual({
            type: "Foo",
            value: "Hello, World!",
        })
    })

    it("should provide a predicate", () => {
        const value = Foo("Hello, World!")
        expect(Foo.is(value)).toBe(true)
        expect(Bar.is(value)).toBe(false)
    })

    it("should work as a type guard", () => {
        const value = Foo("Hello, World!")
        if (Foo.is(value)) {
            assert<IsExact<typeof value, { type: "Foo"; value: string }>>(true)
        }
    })
})

describe("inline impl", () => {
    type Foo = Variant<"Foo", string>
    type Bar = Variant<"Bar", number>
    type Union = Foo | Bar

    const impl = implFactory({ typeKey: "type", inline: true })
    const { Foo, Bar } = impl<Union>()

    it("should construct a variant", () => {
        const actual = Foo({ value: "Hello, World!" })
        expect(actual).toEqual({
            type: "Foo",
            value: "Hello, World!",
        })
    })

    it("should omit colliding properties", () => {
        const value = { value: "Hello, World!", type: "Bar" }
        const actual = Foo(value)
        expect(actual).toEqual({
            type: "Foo",
            value: "Hello, World!",
        })
    })

    it("should provide a type guard", () => {
        const value = Foo({ value: "Hello, World!" })
        expect(Foo.is(value)).toBe(true)
        expect(Bar.is(value)).toBe(false)
    })

    it("should work as a type guard", () => {
        const value = Foo({ value: "Hello, World!" })
        if (Foo.is(value)) {
            assert<IsExact<typeof value, { type: "Foo"; value: string }>>(true)
        }
    })
})
