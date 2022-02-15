import { match, match2, match3, match4 } from "../src"
import { assert, IsExact } from "conditional-type-checks"

interface Foo {
    type: "Foo"
    value: string
}

interface Bar {
    type: "Bar"
    value: number
}

type Union = Foo | Bar

function isFoo<T>(value: T): value is Extract<T, { type: "Foo" }> {
    return typeof value === "object" && value !== null && (value as any)["type"] === "Foo"
}

function mkBar(value: number): Union {
    return { type: "Bar", value }
}

function isBar<T>(value: T): value is Extract<T, { type: "Bar" }> {
    return typeof value === "object" && value !== null && (value as any)["type"] === "Bar"
}

function isAny<T>(value: T): value is T {
    return true
}

describe("match", () => {
    it("should execute the handler of the first match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match(mkBar(42)).with(isFoo, _).with(isBar, MATCH).with(isAny, _).done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith(mkBar(42))
        expect(_).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match(mkBar(42)).with(isFoo, _).with(isAny, MATCH).with(isBar, _).done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith(mkBar(42))
        expect(_).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match(mkBar(42)).with(isFoo, _).done(MATCH)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith(mkBar(42))
        expect(_).not.toHaveBeenCalled()
    })

    it("should infer the correct types", () => {
        const result = match(mkBar(42))
            .with(isFoo, value => {
                assert<IsExact<typeof value, Foo>>(true)
                return 1 as const
            })
            .with(isAny, value => {
                assert<IsExact<typeof value, Union>>(true)
                return 2 as const
            })
            .done(value => {
                assert<IsExact<typeof value, Union>>(true)
                return 3 as const
            })

        assert<IsExact<typeof result, 1 | 2 | 3>>(true)
    })
})

describe("match2", () => {
    it("should execute the handler of the first match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match2([mkBar(42), mkBar(1337)])
            .with([isFoo, isFoo], _)
            .with([isBar, isBar], MATCH)
            .with([isAny, isAny], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match2([mkBar(42), mkBar(1337)])
            .with([isFoo, isFoo], _)
            .with([isAny, isAny], MATCH)
            .with([isBar, isBar], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match2([mkBar(42), mkBar(1337)])
            .with([isFoo, isFoo], _)
            .with([isFoo, isBar], _)
            .with([isBar, isFoo], _)
            .with([isFoo, isAny], _)
            .with([isAny, isFoo], _)
            .done(MATCH)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should infer the correct types", () => {
        const result = match2([mkBar(42), mkBar(1337)])
            .with([isFoo, isAny], value => {
                assert<IsExact<typeof value, [Foo, Union]>>(true)
                return 1 as const
            })
            .with([isAny, isFoo], value => {
                assert<IsExact<typeof value, [Union, Foo]>>(true)
                return 2 as const
            })
            .done(value => {
                assert<IsExact<typeof value, [Union, Union]>>(true)
                return 3 as const
            })

        assert<IsExact<typeof result, 1 | 2 | 3>>(true)
    })
})

describe("match3", () => {
    it("should execute the handler of the first match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match3([mkBar(42), mkBar(1337), mkBar(69)])
            .with([isFoo, isFoo, isFoo], _)
            .with([isBar, isBar, isBar], MATCH)
            .with([isAny, isAny, isAny], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337), mkBar(69)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match3([mkBar(42), mkBar(1337), mkBar(69)])
            .with([isFoo, isFoo, isFoo], _)
            .with([isAny, isAny, isAny], MATCH)
            .with([isBar, isBar, isBar], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337), mkBar(69)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match3([mkBar(42), mkBar(1337), mkBar(69)])
            .with([isFoo, isFoo, isFoo], _)
            .with([isFoo, isFoo, isBar], _)
            .with([isFoo, isBar, isFoo], _)
            .with([isFoo, isBar, isBar], _)
            .with([isBar, isFoo, isFoo], _)
            .with([isBar, isFoo, isBar], _)
            .with([isBar, isBar, isFoo], _)
            .with([isFoo, isAny, isAny], _)
            .with([isAny, isFoo, isAny], _)
            .with([isAny, isAny, isFoo], _)
            .done(MATCH)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337), mkBar(69)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should infer the correct types", () => {
        const result = match3([mkBar(42), mkBar(1337), mkBar(69)])
            .with([isFoo, isAny, isAny], value => {
                assert<IsExact<typeof value, [Foo, Union, Union]>>(true)
                return 1 as const
            })
            .with([isAny, isFoo, isAny], value => {
                assert<IsExact<typeof value, [Union, Foo, Union]>>(true)
                return 2 as const
            })
            .with([isAny, isAny, isFoo], value => {
                assert<IsExact<typeof value, [Union, Union, Foo]>>(true)
                return 3 as const
            })
            .done(value => {
                assert<IsExact<typeof value, [Union, Union, Union]>>(true)
                return 4 as const
            })

        assert<IsExact<typeof result, 1 | 2 | 3 | 4>>(true)
    })
})

describe("match4", () => {
    it("should execute the handler of the first match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match4([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
            .with([isFoo, isFoo, isFoo, isFoo], _)
            .with([isBar, isBar, isBar, isBar], MATCH)
            .with([isAny, isAny, isAny, isAny], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match4([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
            .with([isFoo, isFoo, isFoo, isFoo], _)
            .with([isAny, isAny, isAny, isAny], MATCH)
            .with([isBar, isBar, isBar, isBar], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match4([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
            .with([isFoo, isFoo, isFoo, isFoo], _)
            .with([isFoo, isFoo, isFoo, isBar], _)
            .with([isFoo, isFoo, isBar, isFoo], _)
            .with([isFoo, isFoo, isBar, isBar], _)
            .with([isFoo, isBar, isFoo, isFoo], _)
            .with([isFoo, isBar, isFoo, isBar], _)
            .with([isFoo, isBar, isBar, isFoo], _)
            .with([isFoo, isBar, isBar, isBar], _)
            .with([isBar, isFoo, isFoo, isFoo], _)
            .with([isBar, isFoo, isFoo, isBar], _)
            .with([isBar, isFoo, isBar, isFoo], _)
            .with([isBar, isFoo, isBar, isBar], _)
            .with([isBar, isBar, isFoo, isFoo], _)
            .with([isBar, isBar, isFoo, isBar], _)
            .with([isBar, isBar, isBar, isFoo], _)
            .with([isFoo, isAny, isAny, isAny], _)
            .with([isAny, isFoo, isAny, isAny], _)
            .with([isAny, isAny, isFoo, isAny], _)
            .with([isAny, isAny, isAny, isFoo], _)
            .done(MATCH)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should infer the correct types", () => {
        const result = match4([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
            .with([isFoo, isAny, isAny, isAny], value => {
                assert<IsExact<typeof value, [Foo, Union, Union, Union]>>(true)
                return 1 as const
            })
            .with([isAny, isFoo, isAny, isAny], value => {
                assert<IsExact<typeof value, [Union, Foo, Union, Union]>>(true)
                return 2 as const
            })
            .with([isAny, isAny, isFoo, isAny], value => {
                assert<IsExact<typeof value, [Union, Union, Foo, Union]>>(true)
                return 3 as const
            })
            .with([isAny, isAny, isAny, isFoo], value => {
                assert<IsExact<typeof value, [Union, Union, Union, Foo]>>(true)
                return 4 as const
            })
            .done(value => {
                assert<IsExact<typeof value, [Union, Union, Union, Union]>>(true)
                return 5 as const
            })

        assert<IsExact<typeof result, 1 | 2 | 3 | 4 | 5>>(true)
    })
})
