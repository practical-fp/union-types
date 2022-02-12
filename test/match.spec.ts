import { impl, match, match2, match3, match4, Variant } from "../src"

type Foo = Variant<"Foo", string>
type Bar = Variant<"Bar", number>
type Union = Foo | Bar

const { Foo, Bar } = impl<Union>()

describe("match", () => {
    it("should execute the handler of the first match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match(Bar(42) as Union)
            .with(Foo, handler1)
            .with(Bar, handler2)
            .with(null, handler1)
            .done(handler1)

        expect(result).toBe(2)
        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).toHaveBeenCalledWith(42)
    })

    it("should execute the handler of the wildcard match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match(Bar(42) as Union)
            .with(Foo, handler1)
            .with(null, handler2)
            .with(Bar, handler1)
            .done(handler1)

        expect(result).toBe(2)
        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).toHaveBeenCalledWith(Bar(42))
    })

    it("should call the done callback if there is no match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match(Bar(42) as Union)
            .with(Foo, handler1)
            .done(handler2)

        expect(result).toBe(2)
        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).toHaveBeenCalledWith(Bar(42))
    })
})

describe("match2", () => {
    it("should execute the handler of the first match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match2([Bar(42) as Union, Bar(1337) as Union])
            .with([Foo, Foo], handler1)
            .with([Bar, Bar], handler2)
            .with([null, null], handler1)
            .done(handler1)

        expect(result).toBe(2)
        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).toHaveBeenCalledWith([42, 1337])
    })

    it("should execute the handler of the wildcard match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match2([Bar(42) as Union, Bar(1337) as Union])
            .with([Foo, Foo], handler1)
            .with([null, null], handler2)
            .with([Bar, Bar], handler1)
            .done(handler1)

        expect(result).toBe(2)
        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).toHaveBeenCalledWith([Bar(42), Bar(1337)])
    })

    it("should call the done callback if there is no match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match2([Bar(42) as Union, Bar(1337) as Union])
            .with([Foo, Foo], handler1)
            .with([Foo, Bar], handler1)
            .with([Bar, Foo], handler1)
            .with([Foo, null], handler1)
            .with([null, Foo], handler1)
            .done(handler2)

        expect(result).toBe(2)
        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).toHaveBeenCalledWith([Bar(42), Bar(1337)])
    })
})

describe("match3", () => {
    it("should execute the handler of the first match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match3([Bar(42) as Union, Bar(1337) as Union, Bar(69) as Union])
            .with([Foo, Foo, Foo], handler1)
            .with([Bar, Bar, Bar], handler2)
            .with([null, null, null], handler1)
            .done(handler1)

        expect(result).toBe(2)
        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).toHaveBeenCalledWith([42, 1337, 69])
    })

    it("should execute the handler of the wildcard match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match3([Bar(42) as Union, Bar(1337) as Union, Bar(69) as Union])
            .with([Foo, Foo, Foo], handler1)
            .with([null, null, null], handler2)
            .with([Bar, Bar, Bar], handler1)
            .done(handler1)

        expect(result).toBe(2)
        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).toHaveBeenCalledWith([Bar(42), Bar(1337), Bar(69)])
    })

    it("should call the done callback if there is no match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match3([Bar(42) as Union, Bar(1337) as Union, Bar(69) as Union])
            .with([Foo, Foo, Foo], handler1)
            .with([Foo, Foo, Bar], handler1)
            .with([Foo, Bar, Foo], handler1)
            .with([Foo, Bar, Bar], handler1)
            .with([Bar, Foo, Foo], handler1)
            .with([Bar, Foo, Bar], handler1)
            .with([Bar, Bar, Foo], handler1)
            .with([Foo, null, null], handler1)
            .with([null, Foo, null], handler1)
            .with([null, null, Foo], handler1)
            .done(handler2)

        expect(result).toBe(2)
        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).toHaveBeenCalledWith([Bar(42), Bar(1337), Bar(69)])
    })
})

describe("match4", () => {
    it("should execute the handler of the first match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match4([
            Bar(42) as Union,
            Bar(1337) as Union,
            Bar(69) as Union,
            Bar(-1) as Union,
        ])
            .with([Foo, Foo, Foo, Foo], handler1)
            .with([Bar, Bar, Bar, Bar], handler2)
            .with([null, null, null, null], handler1)
            .done(handler1)

        expect(result).toBe(2)
        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).toHaveBeenCalledWith([42, 1337, 69, -1])
    })

    it("should execute the handler of the wildcard match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match4([
            Bar(42) as Union,
            Bar(1337) as Union,
            Bar(69) as Union,
            Bar(-1) as Union,
        ])
            .with([Foo, Foo, Foo, Foo], handler1)
            .with([null, null, null, null], handler2)
            .with([Bar, Bar, Bar, Bar], handler1)
            .done(handler1)

        expect(result).toBe(2)
        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).toHaveBeenCalledWith([Bar(42), Bar(1337), Bar(69), Bar(-1)])
    })

    it("should call the done callback if there is no match", () => {
        const handler1 = jest.fn(() => 1)
        const handler2 = jest.fn(() => 2)

        const result = match4([
            Bar(42) as Union,
            Bar(1337) as Union,
            Bar(69) as Union,
            Bar(-1) as Union,
        ])
            .with([Foo, Foo, Foo, Foo], handler1)
            .with([Foo, Foo, Foo, Bar], handler1)
            .with([Foo, Foo, Bar, Foo], handler1)
            .with([Foo, Foo, Bar, Bar], handler1)
            .with([Foo, Bar, Foo, Foo], handler1)
            .with([Foo, Bar, Foo, Bar], handler1)
            .with([Foo, Bar, Bar, Foo], handler1)
            .with([Foo, Bar, Bar, Bar], handler1)
            .with([Bar, Foo, Foo, Foo], handler1)
            .with([Bar, Foo, Foo, Bar], handler1)
            .with([Bar, Foo, Bar, Foo], handler1)
            .with([Bar, Foo, Bar, Bar], handler1)
            .with([Bar, Bar, Foo, Foo], handler1)
            .with([Bar, Bar, Foo, Bar], handler1)
            .with([Bar, Bar, Bar, Foo], handler1)
            .with([Foo, null, null, null], handler1)
            .with([null, Foo, null, null], handler1)
            .with([null, null, Foo, null], handler1)
            .with([null, null, null, Foo], handler1)
            .done(handler2)

        expect(result).toBe(2)
        expect(handler1).not.toHaveBeenCalled()
        expect(handler2).toHaveBeenCalledWith([Bar(42), Bar(1337), Bar(69), Bar(-1)])
    })
})
