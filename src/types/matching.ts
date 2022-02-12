import { UnpackTuple, Void } from "./common"

export interface Pattern<Var, Narrowed extends Var> {
    is: (variant: Var) => variant is Narrowed
    valueKey?: keyof (Var | Narrowed)
}

export type OptionalPattern<Var, Narrowed extends Var> = Pattern<Var, Narrowed> | null | undefined

export type PatternValue<Narrowed, P extends OptionalPattern<Narrowed, Narrowed>> = P extends {
    valueKey: PropertyKey
}
    ? Narrowed[P["valueKey"]]
    : Narrowed

export interface Matcher<Var, Result = never, Handled extends Var = never> {
    with<P extends OptionalPattern<Var, Narrowed>, Narrowed extends Var, HandlerReturn>(
        pattern: P,
        handler: (value: PatternValue<Narrowed, P>) => HandlerReturn,
    ): Matcher<Var, Result | HandlerReturn, Handled | Narrowed>

    done<HandlerReturn = never>(
        otherwise: ((variant: Var) => HandlerReturn) | Void<Var, Handled>,
    ): Result | HandlerReturn
}

export interface Matcher2<Var1, Var2, Result = never, Handled extends [Var1, Var2] = never> {
    with<
        P1 extends OptionalPattern<Var1, Narrowed1>,
        Narrowed1 extends Var1,
        P2 extends OptionalPattern<Var2, Narrowed2>,
        Narrowed2 extends Var2,
        HandlerReturn
    >(
        patterns: [P1, P2],
        handler: (
            values: [PatternValue<Narrowed1, P1>, PatternValue<Narrowed2, P2>],
        ) => HandlerReturn,
    ): Matcher2<Var1, Var2, Result | HandlerReturn, Handled | [Narrowed1, Narrowed2]>

    done<HandlerReturn = never>(
        otherwise:
            | ((variants: [Var1, Var2]) => HandlerReturn)
            | Void<UnpackTuple<[Var1, Var2]>, Handled>,
    ): Result | HandlerReturn
}

export interface Matcher3<
    Var1,
    Var2,
    Var3,
    Result = never,
    Handled extends [Var1, Var2, Var3] = never
> {
    with<
        P1 extends OptionalPattern<Var1, Narrowed1>,
        Narrowed1 extends Var1,
        P2 extends OptionalPattern<Var2, Narrowed2>,
        Narrowed2 extends Var2,
        P3 extends OptionalPattern<Var3, Narrowed3>,
        Narrowed3 extends Var3,
        HandlerReturn
    >(
        patterns: [P1, P2, P3],
        handler: (
            values: [
                PatternValue<Narrowed1, P1>,
                PatternValue<Narrowed2, P2>,
                PatternValue<Narrowed3, P3>,
            ],
        ) => HandlerReturn,
    ): Matcher3<
        Var1,
        Var2,
        Var3,
        Result | HandlerReturn,
        Handled | [Narrowed1, Narrowed2, Narrowed3]
    >

    done<HandlerReturn = never>(
        otherwise:
            | ((variants: [Var1, Var2, Var3]) => HandlerReturn)
            | Void<UnpackTuple<[Var1, Var2, Var3]>, Handled>,
    ): Result | HandlerReturn
}

export interface Matcher4<
    Var1,
    Var2,
    Var3,
    Var4,
    Result = never,
    Handled extends [Var1, Var2, Var3, Var4] = never
> {
    with<
        P1 extends OptionalPattern<Var1, Narrowed1>,
        Narrowed1 extends Var1,
        P2 extends OptionalPattern<Var2, Narrowed2>,
        Narrowed2 extends Var2,
        P3 extends OptionalPattern<Var3, Narrowed3>,
        Narrowed3 extends Var3,
        P4 extends OptionalPattern<Var4, Narrowed4>,
        Narrowed4 extends Var4,
        HandlerReturn
    >(
        patterns: [P1, P2, P3, P4],
        handler: (
            values: [
                PatternValue<Narrowed1, P1>,
                PatternValue<Narrowed2, P2>,
                PatternValue<Narrowed3, P3>,
                PatternValue<Narrowed4, P4>,
            ],
        ) => HandlerReturn,
    ): Matcher4<
        Var1,
        Var2,
        Var3,
        Var4,
        Result | HandlerReturn,
        Handled | [Narrowed1, Narrowed2, Narrowed3, Narrowed4]
    >

    done<HandlerReturn = never>(
        otherwise:
            | ((variants: [Var1, Var2, Var3, Var4]) => HandlerReturn)
            | Void<UnpackTuple<[Var1, Var2, Var3, Var4]>, Handled>,
    ): Result | HandlerReturn
}
