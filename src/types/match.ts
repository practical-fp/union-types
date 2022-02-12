import { UnpackTuple, Void } from "./common"

export interface Pattern<Var, Narrowed extends Var, ValueKey extends keyof (Var | Narrowed)> {
    is: (variant: Var) => variant is Narrowed
    valueKey?: ValueKey
}

export type OptionalPattern<Var, Narrowed extends Var, ValueKey extends keyof (Var | Narrowed)> =
    | Pattern<Var, Narrowed, ValueKey>
    | null
    | undefined

export type PatternValue<Narrowed, ValueKey extends keyof Narrowed> = [ValueKey] extends [never]
    ? Narrowed
    : Narrowed[ValueKey]

export interface Matcher<Var, Result = never, Handled extends Var = never> {
    with<Narrowed extends Var, HandlerReturn, ValueKey extends keyof Var = never>(
        pattern: OptionalPattern<Var, Narrowed, ValueKey>,
        handler: (value: PatternValue<Narrowed, ValueKey>) => HandlerReturn,
    ): Matcher<Var, Result | HandlerReturn, Handled | Narrowed>

    done<HandlerReturn = never>(
        otherwise: ((variant: Var) => HandlerReturn) | Void<Var, Handled>,
    ): Result | HandlerReturn
}

export interface Matcher2<Var1, Var2, Result = never, Handled extends [Var1, Var2] = never> {
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
        Result | HandlerReturn,
        Handled | [Narrowed1, Narrowed2, Narrowed3, Narrowed4]
    >

    done<HandlerReturn = never>(
        otherwise:
            | ((variants: [Var1, Var2, Var3, Var4]) => HandlerReturn)
            | Void<UnpackTuple<[Var1, Var2, Var3, Var4]>, Handled>,
    ): Result | HandlerReturn
}
