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

export type PatternValue<
    Var extends Variant<string, unknown, PropertyKey, PropertyKey>,
    P extends Pattern<Var>
> = Narrow<Var, P["type"] & Var[P["typeKey"]], P["typeKey"]>[P["valueKey"]]

export type TuplePattern<
    Vars extends readonly Variant<string, unknown, PropertyKey, PropertyKey>[]
> = { [Idx in keyof Vars]: Pattern<Vars[Idx & number]> }

export type TuplePatternValue<
    Vars extends readonly Variant<string, unknown, PropertyKey, PropertyKey>[],
    P extends TuplePattern<Vars>
> = { [Idx in keyof Vars]: PatternValue<Vars[Idx & number], P[Idx]> }

export interface Match<
    Vars extends readonly Variant<string, unknown, never, never>[],
    Result = never
> {
    with<P extends TuplePattern<Vars>, HandlerReturn>(
        ...args: [...P, (...values: TuplePatternValue<Vars, P>) => HandlerReturn]
    ): Match<Vars, Result | HandlerReturn>

    done(): Result
}

type Union = Variant<"Foo", string> | Variant<"Bar", number>

declare const { Foo, Bar }: Impl<Union>

declare const match: Match<[Union, Union]>

const t = match
    .with(Foo, Bar, (foo, bar) => foo)
    .with(Foo, Bar, (foo, bar) => bar)
    .done()
