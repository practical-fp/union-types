import { UnpackTuple, Void } from "./common"

export type Guard<T, Narrowed extends T> = (variant: T) => variant is Narrowed

export interface Matcher<T, Result = never, Handled extends T = never> {
    with<Narrowed extends T, Return>(
        pattern: Guard<T, Narrowed>,
        handler: (value: Narrowed) => Return,
    ): Matcher<T, Result | Return, Handled | Narrowed>

    done<Return = never>(otherwise: ((variant: T) => Return) | Void<T, Handled>): Result | Return
}

export interface Matcher2<T1, T2, Result = never, Handled extends [T1, T2] = never> {
    with<Narrowed1 extends T1, Narrowed2 extends T2, Return>(
        patterns: [Guard<T1, Narrowed1>, Guard<T2, Narrowed2>],
        handler: (values: [Narrowed1, Narrowed2]) => Return,
    ): Matcher2<T1, T2, Result | Return, Handled | [Narrowed1, Narrowed2]>

    done<Return = never>(
        otherwise: ((variants: [T1, T2]) => Return) | Void<UnpackTuple<[T1, T2]>, Handled>,
    ): Result | Return
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
