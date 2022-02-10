export type TYPE = "type"
export type VALUE = "value"

export type Variant<
    Type extends string,
    Value = unknown,
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE
> = Record<TypeKey, Type> & Record<ValueKey, Value>

export type Narrow<
    Var extends Variant<string, unknown, TypeKey, PropertyKey>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE
> = Extract<Var, Record<TypeKey, Type>>

export type Predicate<
    Var extends Variant<string, unknown, TypeKey, PropertyKey>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE
> = (variant: Var) => variant is Narrow<Var, Type, TypeKey>

export type Constructor<
    Type extends string,
    Value,
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE
> = <T extends Value>(
    value: undefined extends Value ? T | void : T,
) => Variant<Type, T, TypeKey, ValueKey>

export type VariantImpl<
    Var extends Variant<string, unknown, TypeKey, ValueKey>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE
> = Constructor<Type, Narrow<Var, Type, TypeKey>[ValueKey], TypeKey, ValueKey> & {
    type: Type
    typeKey: TypeKey
    valueKey: ValueKey
    is: Predicate<Var, Type, TypeKey>
}

export type Impl<
    Var extends Variant<string, unknown, TypeKey, ValueKey>,
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE
> = {
    [Type in Var[TypeKey]]: VariantImpl<Var, Type, TypeKey, ValueKey>
}

export type Pattern<Var extends Variant<string, unknown, PropertyKey, PropertyKey>> = VariantImpl<
    Var,
    Var[keyof Var],
    keyof Var,
    keyof Var
>

export type PatternVariant<
    Var extends Variant<string, unknown, PropertyKey, PropertyKey>,
    P extends Pattern<Var>
> = Narrow<Var, P["type"] & Var[P["typeKey"]], P["typeKey"]>

export type PatternValue<
    Var extends Variant<string, unknown, PropertyKey, PropertyKey>,
    P extends Pattern<Var>
> = PatternVariant<Var, P>[P["valueKey"]]

export type TuplePattern<
    Vars extends readonly Variant<string, unknown, PropertyKey, PropertyKey>[]
> = { [Idx in keyof Vars]: Pattern<Vars[Idx & number]> }

export type TuplePatternVariant<
    Vars extends readonly Variant<string, unknown, PropertyKey, PropertyKey>[],
    P extends TuplePattern<Vars>
> = { [Idx in keyof Vars]: PatternVariant<Vars[Idx & number], P[Idx]> }

export type TuplePatternValue<
    Vars extends readonly Variant<string, unknown, PropertyKey, PropertyKey>[],
    P extends TuplePattern<Vars>
> = { [Idx in keyof Vars]: PatternValue<Vars[Idx & number], P[Idx]> }

type Unpack<T extends readonly unknown[]> = T extends [infer Head, ...infer Tail]
    ? Head extends any
        ? [Head, ...Unpack<Tail>]
        : never
    : []

export interface MatchTuple<
    Vars extends readonly Variant<string, unknown, never, never>[],
    Result = never
> {
    with<P extends TuplePattern<Vars>, HandlerReturn>(
        pattern: P,
        handler: (values: TuplePatternValue<Vars, P>) => HandlerReturn,
    ): MatchTuple<Exclude<Vars, TuplePatternVariant<Vars, P>>, Result | HandlerReturn>

    done<Return = never>(
        handler: [Vars] extends [never] ? void : (rest: Vars) => Return,
    ): Result | Return
}

export interface Match<Var extends Variant<string, unknown, never, never>, Result = never> {
    with<P extends Pattern<Var>, HandlerReturn>(
        pattern: P,
        handler: (value: PatternValue<Var, P>) => HandlerReturn,
    ): Match<Exclude<Var, PatternVariant<Var, P>>, Result | HandlerReturn>

    done<Return = never>(
        handler: [Var] extends [never] ? void : (rest: Var) => Return,
    ): Result | Return
}

type Union = Variant<"Foo", string> | Variant<"Bar", number>

declare const { Foo, Bar }: Impl<Union>

declare const matchTuple: MatchTuple<Unpack<[Union, Union]>>

const t = matchTuple
    .with([Foo, Foo], ([foo, bar]) => foo)
    .with([Foo, Bar], ([foo, bar]) => bar)
    .with([Bar, Foo], ([foo, bar]) => bar)
    .with([Bar, Bar], ([foo, bar]) => bar)
    .done()

declare const match: Match<Union>

const t2 = match
    .with(Foo, foo => foo)
    .with(Bar, foo => foo)
    .done()
