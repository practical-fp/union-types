import { match, match2, match3, match4 } from "../src"
import { assert, IsExact } from "conditional-type-checks"
import { unknown, field, literal } from "../src/pattern"

interface Foo {
    type: "Foo"
    value: string
}

interface Bar {
    type: "Bar"
    value: number
}

type Union = Foo | Bar

const Foo = field("type", literal("Foo"))
const Bar = field("type", literal("Bar"))

function mkBar(value: number): Union {
    return { type: "Bar", value }
}

describe("match", () => {
    it("should execute the handler of the first match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match(mkBar(42)).with(Foo, _).with(Bar, MATCH).with(unknown, _).done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith(mkBar(42))
        expect(_).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match(mkBar(42)).with(Foo, _).with(unknown, MATCH).with(Bar, _).done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith(mkBar(42))
        expect(_).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match(mkBar(42)).with(Foo, _).done(MATCH)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith(mkBar(42))
        expect(_).not.toHaveBeenCalled()
    })

    it("should infer the correct types", () => {
        const result = match(mkBar(42))
            .with(Foo, value => {
                assert<IsExact<typeof value, Foo>>(true)
                return 1 as const
            })
            .with(unknown, value => {
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
            .with([Foo, Foo], _)
            .with([Bar, Bar], MATCH)
            .with([unknown, unknown], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match2([mkBar(42), mkBar(1337)])
            .with([Foo, Foo], _)
            .with([unknown, unknown], MATCH)
            .with([Bar, Bar], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match2([mkBar(42), mkBar(1337)])
            .with([Foo, Foo], _)
            .with([Foo, Bar], _)
            .with([Bar, Foo], _)
            .with([Foo, unknown], _)
            .with([unknown, Foo], _)
            .done(MATCH)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should infer the correct types", () => {
        const result = match2([mkBar(42), mkBar(1337)])
            .with([Foo, unknown], value => {
                assert<IsExact<typeof value, [Foo, Union]>>(true)
                return 1 as const
            })
            .with([unknown, Foo], value => {
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
            .with([Foo, Foo, Foo], _)
            .with([Bar, Bar, Bar], MATCH)
            .with([unknown, unknown, unknown], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337), mkBar(69)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match3([mkBar(42), mkBar(1337), mkBar(69)])
            .with([Foo, Foo, Foo], _)
            .with([unknown, unknown, unknown], MATCH)
            .with([Bar, Bar, Bar], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337), mkBar(69)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match3([mkBar(42), mkBar(1337), mkBar(69)])
            .with([Foo, Foo, Foo], _)
            .with([Foo, Foo, Bar], _)
            .with([Foo, Bar, Foo], _)
            .with([Foo, Bar, Bar], _)
            .with([Bar, Foo, Foo], _)
            .with([Bar, Foo, Bar], _)
            .with([Bar, Bar, Foo], _)
            .with([Foo, unknown, unknown], _)
            .with([unknown, Foo, unknown], _)
            .with([unknown, unknown, Foo], _)
            .done(MATCH)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337), mkBar(69)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should infer the correct types", () => {
        const result = match3([mkBar(42), mkBar(1337), mkBar(69)])
            .with([Foo, unknown, unknown], value => {
                assert<IsExact<typeof value, [Foo, Union, Union]>>(true)
                return 1 as const
            })
            .with([unknown, Foo, unknown], value => {
                assert<IsExact<typeof value, [Union, Foo, Union]>>(true)
                return 2 as const
            })
            .with([unknown, unknown, Foo], value => {
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
            .with([Foo, Foo, Foo, Foo], _)
            .with([Bar, Bar, Bar, Bar], MATCH)
            .with([unknown, unknown, unknown, unknown], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should execute the handler of the wildcard match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match4([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
            .with([Foo, Foo, Foo, Foo], _)
            .with([unknown, unknown, unknown, unknown], MATCH)
            .with([Bar, Bar, Bar, Bar], _)
            .done(_)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should call the done callback if there is no match", () => {
        const _ = jest.fn(() => 1)
        const MATCH = jest.fn(() => 2)

        const result = match4([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
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
            .with([Foo, unknown, unknown, unknown], _)
            .with([unknown, Foo, unknown, unknown], _)
            .with([unknown, unknown, Foo, unknown], _)
            .with([unknown, unknown, unknown, Foo], _)
            .done(MATCH)

        expect(result).toBe(2)
        expect(MATCH).toHaveBeenCalledWith([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
        expect(_).not.toHaveBeenCalled()
    })

    it("should infer the correct types", () => {
        const result = match4([mkBar(42), mkBar(1337), mkBar(69), mkBar(-1)])
            .with([Foo, unknown, unknown, unknown], value => {
                assert<IsExact<typeof value, [Foo, Union, Union, Union]>>(true)
                return 1 as const
            })
            .with([unknown, Foo, unknown, unknown], value => {
                assert<IsExact<typeof value, [Union, Foo, Union, Union]>>(true)
                return 2 as const
            })
            .with([unknown, unknown, Foo, unknown], value => {
                assert<IsExact<typeof value, [Union, Union, Foo, Union]>>(true)
                return 3 as const
            })
            .with([unknown, unknown, unknown, Foo], value => {
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
