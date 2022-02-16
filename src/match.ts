export type Void<T, U> = [T] extends [U] ? void : never

export type Guard<T, Narrowed extends T> = (variant: T) => variant is Narrowed

export interface Matcher<T, Result = never, Handled extends T = never> {
    with<Narrowed extends T, Return>(
        pattern: Guard<T, Narrowed>,
        handler: (value: Narrowed) => Return,
    ): Matcher<T, Result | Return, Handled | Narrowed>

    done<Return = never>(otherwise: ((variant: T) => Return) | Void<T, Handled>): Result | Return
}

export function match<T>(value: T): Matcher<T> {
    return {
        done<Return>(otherwise: (variant: T) => Return): Return {
            return otherwise(value)
        },
        with<Narrowed extends T, Return>(
            pattern: Guard<T, Narrowed>,
            handler: (value: Narrowed) => Return,
        ): Matcher<T, Return, Narrowed> {
            if (!pattern(value)) {
                return this
            }

            const result = handler(value)

            return {
                done(): Return {
                    return result
                },
                with(): Matcher<T, Return, T> {
                    return this
                },
            }
        },
    }
}

export type UnpackTuple<T extends unknown[]> = T extends [infer Head, ...infer Tail]
    ? Head extends any
        ? [Head, ...UnpackTuple<Tail>]
        : never
    : []

export interface Matcher2<T1, T2, Result = never, Handled extends [T1, T2] = never> {
    with<Narrowed1 extends T1, Narrowed2 extends T2, Return>(
        patterns: [Guard<T1, Narrowed1>, Guard<T2, Narrowed2>],
        handler: (values: [Narrowed1, Narrowed2]) => Return,
    ): Matcher2<T1, T2, Result | Return, Handled | [Narrowed1, Narrowed2]>

    done<Return = never>(
        otherwise: ((variants: [T1, T2]) => Return) | Void<UnpackTuple<[T1, T2]>, Handled>,
    ): Result | Return
}

export function match2<T1, T2>(values: [T1, T2]): Matcher2<T1, T2> {
    return {
        done<Return>(otherwise: (variants: [T1, T2]) => Return): Return {
            return otherwise(values)
        },
        with<Narrowed1 extends T1, Narrowed2 extends T2, Return>(
            patterns: [Guard<T1, Narrowed1>, Guard<T2, Narrowed2>],
            handler: (values: [Narrowed1, Narrowed2]) => Return,
        ): Matcher2<T1, T2, Return, [Narrowed1, Narrowed2]> {
            const [pattern1, pattern2] = patterns
            const [value1, value2] = values

            if (!pattern1(value1) || !pattern2(value2)) {
                return this
            }

            const result = handler([value1, value2])

            return {
                done(): Return {
                    return result
                },
                with(): Matcher2<T1, T2, Return, [T1, T2]> {
                    return this
                },
            }
        },
    }
}

export interface Matcher3<T1, T2, T3, Result = never, Handled extends [T1, T2, T3] = never> {
    with<Narrowed1 extends T1, Narrowed2 extends T2, Narrowed3 extends T3, Return>(
        patterns: [Guard<T1, Narrowed1>, Guard<T2, Narrowed2>, Guard<T3, Narrowed3>],
        handler: (values: [Narrowed1, Narrowed2, Narrowed3]) => Return,
    ): Matcher3<T1, T2, T3, Result | Return, Handled | [Narrowed1, Narrowed2, Narrowed3]>

    done<Return = never>(
        otherwise: ((variants: [T1, T2, T3]) => Return) | Void<UnpackTuple<[T1, T2, T3]>, Handled>,
    ): Result | Return
}

export function match3<T1, T2, T3>(variants: [T1, T2, T3]): Matcher3<T1, T2, T3> {
    return {
        done<Return>(otherwise: (variants: [T1, T2, T3]) => Return): Return {
            return otherwise(variants)
        },
        with<Narrowed1 extends T1, Narrowed2 extends T2, Narrowed3 extends T3, Return>(
            patterns: [Guard<T1, Narrowed1>, Guard<T2, Narrowed2>, Guard<T3, Narrowed3>],
            handler: (values: [Narrowed1, Narrowed2, Narrowed3]) => Return,
        ): Matcher3<T1, T2, T3, Return, [Narrowed1, Narrowed2, Narrowed3]> {
            const [pattern1, pattern2, pattern3] = patterns
            const [value1, value2, value3] = variants

            if (!pattern1(value1) || !pattern2(value2) || !pattern3(value3)) {
                return this
            }

            const result = handler([value1, value2, value3])

            return {
                done(): Return {
                    return result
                },
                with(): Matcher3<T1, T2, T3, Return, [T1, T2, T3]> {
                    return this
                },
            }
        },
    }
}

export interface Matcher4<
    T1,
    T2,
    T3,
    T4,
    Result = never,
    Handled extends [T1, T2, T3, T4] = never,
> {
    with<
        Narrowed1 extends T1,
        Narrowed2 extends T2,
        Narrowed3 extends T3,
        Narrowed4 extends T4,
        Return,
    >(
        patterns: [
            Guard<T1, Narrowed1>,
            Guard<T2, Narrowed2>,
            Guard<T3, Narrowed3>,
            Guard<T4, Narrowed4>,
        ],
        handler: (values: [Narrowed1, Narrowed2, Narrowed3, Narrowed4]) => Return,
    ): Matcher4<
        T1,
        T2,
        T3,
        T4,
        Result | Return,
        Handled | [Narrowed1, Narrowed2, Narrowed3, Narrowed4]
    >

    done<Return = never>(
        otherwise:
            | ((variants: [T1, T2, T3, T4]) => Return)
            | Void<UnpackTuple<[T1, T2, T3, T4]>, Handled>,
    ): Result | Return
}

export function match4<T1, T2, T3, T4>(variants: [T1, T2, T3, T4]): Matcher4<T1, T2, T3, T4> {
    return {
        done<Return>(otherwise: (variants: [T1, T2, T3, T4]) => Return): Return {
            return otherwise(variants)
        },
        with<
            Narrowed1 extends T1,
            Narrowed2 extends T2,
            Narrowed3 extends T3,
            Narrowed4 extends T4,
            Return,
        >(
            patterns: [
                Guard<T1, Narrowed1>,
                Guard<T2, Narrowed2>,
                Guard<T3, Narrowed3>,
                Guard<T4, Narrowed4>,
            ],
            handler: (values: [Narrowed1, Narrowed2, Narrowed3, Narrowed4]) => Return,
        ): Matcher4<T1, T2, T3, T4, Return, [Narrowed1, Narrowed2, Narrowed3, Narrowed4]> {
            const [pattern1, pattern2, pattern3, pattern4] = patterns
            const [value1, value2, value3, value4] = variants

            if (!pattern1(value1) || !pattern2(value2) || !pattern3(value3) || !pattern4(value4)) {
                return this
            }

            const result = handler([value1, value2, value3, value4])

            return {
                done(): Return {
                    return result
                },
                with(): Matcher4<T1, T2, T3, T4, Return, [T1, T2, T3, T4]> {
                    return this
                },
            }
        },
    }
}
