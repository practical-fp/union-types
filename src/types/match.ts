import { Narrow, UnpackTuple, Void } from "./common"

export interface Pattern<Type, TypeKey extends PropertyKey, ValueKey extends PropertyKey> {
    type: Type
    typeKey: TypeKey
    valueKey?: ValueKey
}

export type OptionalPattern<Type, TypeKey extends PropertyKey, ValueKey extends PropertyKey> =
    | Pattern<Type, TypeKey, ValueKey>
    | null
    | undefined

export type PatternValue<
    Var,
    Type extends Var[TypeKey],
    TypeKey extends keyof Var,
    ValueKey extends keyof Var
> = [ValueKey] extends [never] ? Narrow<Var, Type, TypeKey> : Narrow<Var, Type, TypeKey>[ValueKey]

export interface Matcher<Var, Result = never, Handled extends Var = never> {
    with<
        HandlerReturn,
        Type extends Var[TypeKey],
        TypeKey extends keyof Var,
        ValueKey extends keyof Var = never
    >(
        pattern: OptionalPattern<Type, TypeKey, ValueKey>,
        handler: (value: PatternValue<Var, Type, TypeKey, ValueKey>) => HandlerReturn,
    ): Matcher<Var, Result | HandlerReturn, Handled | Narrow<Var, Type, TypeKey>>

    done<HandlerReturn = never>(
        otherwise: ((variant: Var) => HandlerReturn) | Void<Var, Handled>,
    ): Result | HandlerReturn
}

export interface Matcher2<Var1, Var2, Result = never, Handled extends [Var1, Var2] = never> {
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
        Result | HandlerReturn,
        Handled | [Narrow<Var1, Type1, TypeKey1>, Narrow<Var2, Type2, TypeKey2>]
    >

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
        Result | HandlerReturn,
        | Handled
        | [
              Narrow<Var1, Type1, TypeKey1>,
              Narrow<Var2, Type2, TypeKey2>,
              Narrow<Var3, Type3, TypeKey3>,
          ]
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
        Result | HandlerReturn,
        | Handled
        | [
              Narrow<Var1, Type1, TypeKey1>,
              Narrow<Var2, Type2, TypeKey2>,
              Narrow<Var3, Type3, TypeKey3>,
              Narrow<Var4, Type4, TypeKey4>,
          ]
    >

    done<HandlerReturn = never>(
        otherwise:
            | ((variants: [Var1, Var2, Var3, Var4]) => HandlerReturn)
            | Void<UnpackTuple<[Var1, Var2, Var3, Var4]>, Handled>,
    ): Result | HandlerReturn
}
