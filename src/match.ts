import { Matcher, Matcher2, Matcher3, Matcher4, OptionalPattern, PatternValue } from "./types"

export function match<Var>(variant: Var): Matcher<Var> {
    return {
        done<HandlerReturn>(otherwise: (variant: Var) => HandlerReturn): HandlerReturn {
            return otherwise(variant)
        },
        with<Narrowed extends Var, HandlerReturn, ValueKey extends keyof Var = never>(
            pattern: OptionalPattern<Var, Narrowed, ValueKey>,
            handler: (value: PatternValue<Narrowed, ValueKey>) => HandlerReturn,
        ): Matcher<Var, HandlerReturn, Narrowed> {
            if (pattern && !pattern.is(variant)) {
                return this
            }

            const value = pattern?.valueKey !== undefined ? variant[pattern.valueKey] : variant
            const result = handler(value as never)

            return {
                done(): HandlerReturn {
                    return result
                },
                with(): Matcher<Var, HandlerReturn, Var> {
                    return this
                },
            }
        },
    }
}

export function match2<Var1, Var2>(variants: [Var1, Var2]): Matcher2<Var1, Var2> {
    return {
        done<HandlerReturn>(otherwise: (variants: [Var1, Var2]) => HandlerReturn): HandlerReturn {
            return otherwise(variants)
        },
        with<
            Narrowed1 extends Var1,
            Narrowed2 extends Var2,
            HandlerReturn,
            ValueKey1 extends keyof Var1 = never,
            ValueKey2 extends keyof Var2 = never
        >(
            patterns: [
                OptionalPattern<Var1, Narrowed1, ValueKey1>,
                OptionalPattern<Var2, Narrowed2, ValueKey2>,
            ],
            handler: (
                values: [PatternValue<Narrowed1, ValueKey1>, PatternValue<Narrowed2, ValueKey2>],
            ) => HandlerReturn,
        ): Matcher2<Var1, Var2, HandlerReturn, [Narrowed1, Narrowed2]> {
            const [pattern1, pattern2] = patterns
            const [variant1, variant2] = variants

            if ((pattern1 && !pattern1.is(variant1)) || (pattern2 && !pattern2.is(variant2))) {
                return this
            }

            const value1 = pattern1?.valueKey !== undefined ? variant1[pattern1.valueKey] : variant1
            const value2 = pattern2?.valueKey !== undefined ? variant2[pattern2.valueKey] : variant2
            const result = handler([value1, value2] as never)

            return {
                done(): HandlerReturn {
                    return result
                },
                with(): Matcher2<Var1, Var2, HandlerReturn, [Var1, Var2]> {
                    return this
                },
            }
        },
    }
}

export function match3<Var1, Var2, Var3>(variants: [Var1, Var2, Var3]): Matcher3<Var1, Var2, Var3> {
    return {
        done<HandlerReturn>(
            otherwise: (variants: [Var1, Var2, Var3]) => HandlerReturn,
        ): HandlerReturn {
            return otherwise(variants)
        },
        with<
            Narrowed1 extends Var1,
            Narrowed2 extends Var2,
            Narrowed3 extends Var3,
            HandlerReturn,
            ValueKey1 extends keyof Var1 = never,
            ValueKey2 extends keyof Var2 = never,
            ValueKey3 extends keyof Var3 = never
        >(
            patterns: [
                OptionalPattern<Var1, Narrowed1, ValueKey1>,
                OptionalPattern<Var2, Narrowed2, ValueKey2>,
                OptionalPattern<Var3, Narrowed3, ValueKey3>,
            ],
            handler: (
                values: [
                    PatternValue<Narrowed1, ValueKey1>,
                    PatternValue<Narrowed2, ValueKey2>,
                    PatternValue<Narrowed3, ValueKey3>,
                ],
            ) => HandlerReturn,
        ): Matcher3<Var1, Var2, Var3, HandlerReturn, [Narrowed1, Narrowed2, Narrowed3]> {
            const [pattern1, pattern2, pattern3] = patterns
            const [variant1, variant2, variant3] = variants

            if (
                (pattern1 && !pattern1.is(variant1)) ||
                (pattern2 && !pattern2.is(variant2)) ||
                (pattern3 && !pattern3.is(variant3))
            ) {
                return this
            }

            const value1 = pattern1?.valueKey !== undefined ? variant1[pattern1.valueKey] : variant1
            const value2 = pattern2?.valueKey !== undefined ? variant2[pattern2.valueKey] : variant2
            const value3 = pattern3?.valueKey !== undefined ? variant3[pattern3.valueKey] : variant3
            const result = handler([value1, value2, value3] as never)

            return {
                done(): HandlerReturn {
                    return result
                },
                with(): Matcher3<Var1, Var2, Var3, HandlerReturn, [Var1, Var2, Var3]> {
                    return this
                },
            }
        },
    }
}

export function match4<Var1, Var2, Var3, Var4>(
    variants: [Var1, Var2, Var3, Var4],
): Matcher4<Var1, Var2, Var3, Var4> {
    return {
        done<HandlerReturn>(
            otherwise: (variants: [Var1, Var2, Var3, Var4]) => HandlerReturn,
        ): HandlerReturn {
            return otherwise(variants)
        },
        with<
            Narrowed1 extends Var1,
            Narrowed2 extends Var2,
            Narrowed3 extends Var3,
            Narrowed4 extends Var4,
            HandlerReturn,
            ValueKey1 extends keyof Var1 = never,
            ValueKey2 extends keyof Var2 = never,
            ValueKey3 extends keyof Var3 = never,
            ValueKey4 extends keyof Var4 = never
        >(
            patterns: [
                OptionalPattern<Var1, Narrowed1, ValueKey1>,
                OptionalPattern<Var2, Narrowed2, ValueKey2>,
                OptionalPattern<Var3, Narrowed3, ValueKey3>,
                OptionalPattern<Var4, Narrowed4, ValueKey4>,
            ],
            handler: (
                values: [
                    PatternValue<Narrowed1, ValueKey1>,
                    PatternValue<Narrowed2, ValueKey2>,
                    PatternValue<Narrowed3, ValueKey3>,
                    PatternValue<Narrowed4, ValueKey4>,
                ],
            ) => HandlerReturn,
        ): Matcher4<
            Var1,
            Var2,
            Var3,
            Var4,
            HandlerReturn,
            [Narrowed1, Narrowed2, Narrowed3, Narrowed4]
        > {
            const [pattern1, pattern2, pattern3, pattern4] = patterns
            const [variant1, variant2, variant3, variant4] = variants

            if (
                (pattern1 && !pattern1.is(variant1)) ||
                (pattern2 && !pattern2.is(variant2)) ||
                (pattern3 && !pattern3.is(variant3)) ||
                (pattern4 && !pattern4.is(variant4))
            ) {
                return this
            }

            const value1 = pattern1?.valueKey !== undefined ? variant1[pattern1.valueKey] : variant1
            const value2 = pattern2?.valueKey !== undefined ? variant2[pattern2.valueKey] : variant2
            const value3 = pattern3?.valueKey !== undefined ? variant3[pattern3.valueKey] : variant3
            const value4 = pattern4?.valueKey !== undefined ? variant4[pattern4.valueKey] : variant4
            const result = handler([value1, value2, value3, value4] as never)

            return {
                done(): HandlerReturn {
                    return result
                },
                with(): Matcher4<Var1, Var2, Var3, Var4, HandlerReturn, [Var1, Var2, Var3, Var4]> {
                    return this
                },
            }
        },
    }
}
