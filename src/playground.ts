export type TYPE = "type"
export type VALUE = "value"

export type Variant<
    Type extends string,
    Value = unknown,
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE
> = Record<TypeKey, Type> & Record<ValueKey, Value>

export type Narrow<
    Var extends object,
    Type extends string,
    TypeKey extends PropertyKey = TYPE
> = Extract<Var, Record<TypeKey, Type>>

export type Predicate<
    Var extends Record<TypeKey, string>,
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
) => Record<TypeKey, Type> & Record<ValueKey, T>

export type VariantImpl<
    Var extends Record<TypeKey, string> & Record<ValueKey, unknown>,
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
    Var extends Record<TypeKey, string> & Record<ValueKey, unknown>,
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE
> = {
    [Type in Var[TypeKey]]: VariantImpl<Var, Type, TypeKey, ValueKey>
}

export type Pattern<Var extends object> =
    | { type: string; typeKey: keyof Var; valueKey: keyof Var }
    | null
    | undefined

export type NarrowPattern<Var extends object, P extends Pattern<Var>> = P extends {
    type: infer Type
    typeKey: infer TypeKey
}
    ? Narrow<Var, Type & string, TypeKey & PropertyKey>
    : Var

export type PatternValue<Var extends object, P extends Pattern<Var>> = P extends {
    valueKey: infer ValueKey
}
    ? NarrowPattern<Var, P>[ValueKey & keyof Var]
    : Var

export interface Matcher<Var extends object, Result = never, Handled extends Var = never> {
    with<P extends Pattern<Var>, HandlerReturn>(
        pattern: P,
        handler: (value: PatternValue<Var, P>) => HandlerReturn,
    ): Matcher<Var, Result | HandlerReturn, Handled | NarrowPattern<Var, P>>

    done(): Result | Exclude<Var, Handled>
}

export type TuplePattern<Vars extends object[]> = {
    [Idx in keyof Vars]: Pattern<Vars[Idx & number]>
}

export type NarrowTuplePattern<Vars extends object[], P extends TuplePattern<Vars>> = {
    [Idx in keyof Vars]: NarrowPattern<Vars[Idx & number], P[Idx]>
}

export type TuplePatternValue<Vars extends object[], P extends TuplePattern<Vars>> = {
    [Idx in keyof Vars]: PatternValue<Vars[Idx & number], P[Idx]>
}

type Unpack<T extends unknown[]> = T extends [infer Head, ...infer Tail]
    ? Head extends any
        ? [Head, ...Unpack<Tail>]
        : never
    : []

export interface TupleMatcher<Vars extends object[], Result = never, Handled extends Vars = never> {
    with<P extends TuplePattern<Vars>, HandlerReturn>(
        pattern: P,
        handler: (values: TuplePatternValue<Vars, P>) => HandlerReturn,
    ): TupleMatcher<Vars, Result | HandlerReturn, Handled | NarrowTuplePattern<Vars, P>>

    done(): Result | Exclude<Unpack<Vars>, Handled>
}

type Union = Variant<"Foo", string> | Variant<"Bar", number>

declare const { Foo, Bar }: Impl<Union>

declare const matchTuple: TupleMatcher<[Union, Union]>

const t = matchTuple
    .with([Foo, Foo], ([foo, bar]) => 42)
    .with([Foo, Bar], ([foo, bar]) => 42)
    .with([Bar, null], ([foo, bar]) => 42)
    .done()

declare const match: Matcher<Union>

const t2 = match
    .with(Foo, foo => foo)
    .with(Bar, foo => foo)
    .done()
