import { impl, match, match2, match3, match4, Variant } from "../src"

type Foo = Variant<"Foo", string>
type Bar = Variant<"Bar", number>
type Union = Foo | Bar

const { Foo, Bar } = impl<Union>()

describe("match", () => {
    it("should execute the handler of the first match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match(Bar(42) as Union)
            .with(Foo, _)
            .with(Bar, MATCH)
            .with(null, _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith(42)
        expect(_).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match(Bar(42) as Union)
            .with(Foo, _)
            .with(null, MATCH)
            .with(Bar, _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith(Bar(42))
        expect(_).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match(Bar(42) as Union)
            .with(Foo, _)
            .done(MATCH)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith(Bar(42))
        expect(_).not.toHaveBeenCalled()
    })
})

describe("match2", () => {
    it("should execute the handler of the first match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match2([Bar(42) as Union, Bar(1337) as Union])
            .with([Foo, Foo], _)
            .with([Bar, Bar], MATCH)
            .with([null, null], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([42, 1337])
        expect(_).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match2([Bar(42) as Union, Bar(1337) as Union])
            .with([Foo, Foo], _)
            .with([null, null], MATCH)
            .with([Bar, Bar], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([Bar(42), Bar(1337)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match2([Bar(42) as Union, Bar(1337) as Union])
            .with([Foo, Foo], _)
            .with([Foo, Bar], _)
            .with([Bar, Foo], _)
            .with([Foo, null], _)
            .with([null, Foo], _)
            .done(MATCH)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([Bar(42), Bar(1337)])
        expect(_).not.toHaveBeenCalled()
    })
})

describe("match3", () => {
    it("should execute the handler of the first match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match3([Bar(42) as Union, Bar(1337) as Union, Bar(69) as Union])
            .with([Foo, Foo, Foo], _)
            .with([Bar, Bar, Bar], MATCH)
            .with([null, null, null], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([42, 1337, 69])
        expect(_).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match3([Bar(42) as Union, Bar(1337) as Union, Bar(69) as Union])
            .with([Foo, Foo, Foo], _)
            .with([null, null, null], MATCH)
            .with([Bar, Bar, Bar], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([Bar(42), Bar(1337), Bar(69)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match3([Bar(42) as Union, Bar(1337) as Union, Bar(69) as Union])
            .with([Foo, Foo, Foo], _)
            .with([Foo, Foo, Bar], _)
            .with([Foo, Bar, Foo], _)
            .with([Foo, Bar, Bar], _)
            .with([Bar, Foo, Foo], _)
            .with([Bar, Foo, Bar], _)
            .with([Bar, Bar, Foo], _)
            .with([Foo, null, null], _)
            .with([null, Foo, null], _)
            .with([null, null, Foo], _)
            .done(MATCH)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([Bar(42), Bar(1337), Bar(69)])
        expect(_).not.toHaveBeenCalled()
    })
})

describe("match4", () => {
    it("should execute the handler of the first match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match4([
            Bar(42) as Union,
            Bar(1337) as Union,
            Bar(69) as Union,
            Bar(-1) as Union,
        ])
            .with([Foo, Foo, Foo, Foo], _)
            .with([Bar, Bar, Bar, Bar], MATCH)
            .with([null, null, null, null], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([42, 1337, 69, -1])
        expect(_).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match4([
            Bar(42) as Union,
            Bar(1337) as Union,
            Bar(69) as Union,
            Bar(-1) as Union,
        ])
            .with([Foo, Foo, Foo, Foo], _)
            .with([null, null, null, null], MATCH)
            .with([Bar, Bar, Bar, Bar], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([Bar(42), Bar(1337), Bar(69), Bar(-1)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match4([
            Bar(42) as Union,
            Bar(1337) as Union,
            Bar(69) as Union,
            Bar(-1) as Union,
        ])
            .with([Foo, Foo, Foo, Foo], _)
            .with([Foo, Foo, Foo, Bar], _)
            .with([Foo, Foo, Bar, Foo], _)
            .with([Foo, Foo, Bar, Bar], _)
            .with([Foo, Bar, Foo, Foo], _)
            .with([Foo, Bar, Foo, Bar], _)
            .with([Foo, Bar, Bar, Foo], _)
            .with([Foo, Bar, Bar, Bar], _)
            .with([Bar, Foo, Foo, Foo], _)
            .with([Bar, Foo, Foo, Bar], _)
            .with([Bar, Foo, Bar, Foo], _)
            .with([Bar, Foo, Bar, Bar], _)
            .with([Bar, Bar, Foo, Foo], _)
            .with([Bar, Bar, Foo, Bar], _)
            .with([Bar, Bar, Bar, Foo], _)
            .with([Foo, null, null, null], _)
            .with([null, Foo, null, null], _)
            .with([null, null, Foo, null], _)
            .with([null, null, null, Foo], _)
            .done(MATCH)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([Bar(42), Bar(1337), Bar(69), Bar(-1)])
        expect(_).not.toHaveBeenCalled()
    })
})