import {
    Matcher,
    NarrowPattern,
    NarrowTuplePattern,
    Pattern,
    PatternValue,
    TupleMatcher,
    TuplePattern,
    TuplePatternValue,
    Unpack,
} from "./types"

function matcher<Var extends object>(variant: Var): Matcher<Var> {
    return {
        done(): Var {
            return variant
        },
        with<P extends Pattern<Var>, HandlerReturn>(
            pattern: P,
            handler: (value: PatternValue<Var, P>) => HandlerReturn,
        ): Matcher<Var, HandlerReturn, NarrowPattern<Var, P>> {
            const matches = !pattern || variant[pattern.typeKey] === (pattern.type as never)
            if (!matches) {
                return this as never
            }

            const value = pattern?.valueKey !== undefined ? variant[pattern.valueKey] : variant
            const result = handler(value as never)

            return {
                done(): HandlerReturn {
                    return result
                },
                with(): Matcher<Var, HandlerReturn, any> {
                    return this
                },
            }
        },
    }
}

function tupleMatcher<Vars extends object[]>(variants: [...Vars]): TupleMatcher<Vars> {
    return {
        done(): Unpack<Vars> {
            return variants as never
        },
        with<P extends TuplePattern<Vars>, HandlerReturn>(
            patterns: P,
            handler: (values: TuplePatternValue<Vars, P>) => HandlerReturn,
        ): TupleMatcher<Vars, HandlerReturn, NarrowTuplePattern<Vars, P>> {
            const matches = variants.every((variant, index) => {
                const pattern = patterns[index]
                return !pattern || variant[pattern.typeKey] === (pattern.type as never)
            })
            if (!matches) {
                return this as never
            }

            const value = variants.map((variant, index) => {
                const pattern = patterns[index]
                if (pattern?.valueKey !== undefined) {
                    return variant[pattern.valueKey]
                } else {
                    return variant
                }
            })
            const result = handler(value as never)

            return {
                done(): HandlerReturn {
                    return result
                },
                with(): TupleMatcher<Vars, HandlerReturn, any> {
                    return this
                },
            }
        },
    }
}

export function match<Vars extends object[]>(variants: [...Vars]): TupleMatcher<Vars>
export function match<Var extends object>(variant: Var): Matcher<Var>
export function match(variants: object | object[]): Matcher<object> | TupleMatcher<object[]> {
    if (Array.isArray(variants)) {
        return tupleMatcher(variants)
    } else {
        return matcher(variants)
    }
}