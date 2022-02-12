import { impl, match, Variant } from "../src"

type Foo = Variant<"Foo", string>
type Bar = Variant<"Bar", number>
type Union = Foo | Bar

const { Foo, Bar } = impl<Union>()

describe("match", () => {
    it("should execute the handler of the first match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)
        const handler3 = jest.fn(() => 3)
        const handler4 = jest.fn(() => 4)

        const value = 42
        const result = match(Bar(value) as Union)
            .with(Foo, handler1)
            .with(Bar, handler2)
            .with(null, handler3)
            .done(handler4)

        expect(result).toBe(2)
        expect(handler2).toHaveBeenCalledWith(value)

        expect(handler1).not.toHaveBeenCalled()
        expect(handler3).not.toHaveBeenCalled()
        expect(handler4).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)
        const handler3 = jest.fn(() => 3)
        const handler4 = jest.fn(() => 4)

        const union = Bar(42)
        const result = match(union as Union)
            .with(Foo, handler1)
            .with(null, handler2)
            .with(Bar, handler3)
            .done(handler4)

        expect(result).toBe(2)
        expect(handler2).toHaveBeenCalledWith(union)

        expect(handler1).not.toHaveBeenCalled()
        expect(handler3).not.toHaveBeenCalled()
        expect(handler4).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match(Bar(42) as Union)
            .with(Foo, handler1)
            .done(handler2)

        expect(result).toBe(2)

        expect(handler1).not.toHaveBeenCalled()
    })
})
