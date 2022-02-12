import {
    Matcher,
    Matcher2,
    Matcher3,
    Matcher4,
    Narrow,
    OptionalPattern,
    PatternValue,
} from "./types"

export function match<Var>(variant: Var): Matcher<Var> {
    return {
        done<HandlerReturn>(otherwise: (variant: Var) => HandlerReturn): HandlerReturn {
            return otherwise(variant)
        },
        with<
            HandlerReturn,
            Type extends Var[TypeKey],
            TypeKey extends keyof Var,
            ValueKey extends keyof Var = never
        >(
            pattern: OptionalPattern<Type, TypeKey, ValueKey>,
            handler: (value: PatternValue<Var, Type, TypeKey, ValueKey>) => HandlerReturn,
        ): Matcher<Var, HandlerReturn, Narrow<Var, Type, TypeKey>> {
            if (pattern && variant[pattern.typeKey] !== pattern.type) {
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
            HandlerReturn,
            Type1 extends Var1[TypeKey1],
            Type2 extends Var2[TypeKey2],
            TypeKey1 extends keyof Var1,
            TypeKey2 extends keyof Var2,
            ValueKey1 extends keyof Var1 = never,
            ValueKey2 extends keyof Var2 = never
        >(
            patterns: [
                OptionalPattern<Type1, TypeKey1, ValueKey1>,
                OptionalPattern<Type2, TypeKey2, ValueKey2>,
            ],
            handler: (
                values: [
                    PatternValue<Var1, Type1, TypeKey1, ValueKey1>,
                    PatternValue<Var2, Type2, TypeKey2, ValueKey2>,
                ],
            ) => HandlerReturn,
        ): Matcher2<
            Var1,
            Var2,
            HandlerReturn,
            [Narrow<Var1, Type1, TypeKey1>, Narrow<Var2, Type2, TypeKey2>]
        > {
            const [pattern1, pattern2] = patterns
            const [variant1, variant2] = variants

            if (
                (pattern1 && variant1[pattern1.typeKey] !== pattern1.type) ||
                (pattern2 && variant2[pattern2.typeKey] !== pattern2.type)
            ) {
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
            HandlerReturn,
            Type1 extends Var1[TypeKey1],
            Type2 extends Var2[TypeKey2],
            Type3 extends Var3[TypeKey3],
            TypeKey1 extends keyof Var1,
            TypeKey2 extends keyof Var2,
            TypeKey3 extends keyof Var3,
            ValueKey1 extends keyof Var1 = never,
            ValueKey2 extends keyof Var2 = never,
            ValueKey3 extends keyof Var3 = never
        >(
            patterns: [
                OptionalPattern<Type1, TypeKey1, ValueKey1>,
                OptionalPattern<Type2, TypeKey2, ValueKey2>,
                OptionalPattern<Type3, TypeKey3, ValueKey3>,
            ],
            handler: (
                values: [
                    PatternValue<Var1, Type1, TypeKey1, ValueKey1>,
                    PatternValue<Var2, Type2, TypeKey2, ValueKey2>,
                    PatternValue<Var3, Type3, TypeKey3, ValueKey3>,
                ],
            ) => HandlerReturn,
        ): Matcher3<
            Var1,
            Var2,
            Var3,
            HandlerReturn,
            [
                Narrow<Var1, Type1, TypeKey1>,
                Narrow<Var2, Type2, TypeKey2>,
                Narrow<Var3, Type3, TypeKey3>,
            ]
        > {
            const [pattern1, pattern2, pattern3] = patterns
            const [variant1, variant2, variant3] = variants

            if (
                (pattern1 && variant1[pattern1.typeKey] !== pattern1.type) ||
                (pattern2 && variant2[pattern2.typeKey] !== pattern2.type) ||
                (pattern3 && variant3[pattern3.typeKey] !== pattern3.type)
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
            HandlerReturn,
            Type1 extends Var1[TypeKey1],
            Type2 extends Var2[TypeKey2],
            Type3 extends Var3[TypeKey3],
            Type4 extends Var4[TypeKey4],
            TypeKey1 extends keyof Var1,
            TypeKey2 extends keyof Var2,
            TypeKey3 extends keyof Var3,
            TypeKey4 extends keyof Var4,
            ValueKey1 extends keyof Var1 = never,
            ValueKey2 extends keyof Var2 = never,
            ValueKey3 extends keyof Var3 = never,
            ValueKey4 extends keyof Var4 = never
        >(
            patterns: [
                OptionalPattern<Type1, TypeKey1, ValueKey1>,
                OptionalPattern<Type2, TypeKey2, ValueKey2>,
                OptionalPattern<Type3, TypeKey3, ValueKey3>,
                OptionalPattern<Type4, TypeKey4, ValueKey4>,
            ],
            handler: (
                values: [
                    PatternValue<Var1, Type1, TypeKey1, ValueKey1>,
                    PatternValue<Var2, Type2, TypeKey2, ValueKey2>,
                    PatternValue<Var3, Type3, TypeKey3, ValueKey3>,
                    PatternValue<Var4, Type4, TypeKey4, ValueKey4>,
                ],
            ) => HandlerReturn,
        ): Matcher4<
            Var1,
            Var2,
            Var3,
            Var4,
            HandlerReturn,
            [
                Narrow<Var1, Type1, TypeKey1>,
                Narrow<Var2, Type2, TypeKey2>,
                Narrow<Var3, Type3, TypeKey3>,
                Narrow<Var4, Type4, TypeKey4>,
            ]
        > {
            const [pattern1, pattern2, pattern3, pattern4] = patterns
            const [variant1, variant2, variant3, variant4] = variants

            if (
                (pattern1 && variant1[pattern1.typeKey] !== pattern1.type) ||
                (pattern2 && variant2[pattern2.typeKey] !== pattern2.type) ||
                (pattern3 && variant3[pattern3.typeKey] !== pattern3.type) ||
                (pattern4 && variant4[pattern4.typeKey] !== pattern4.type)
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
