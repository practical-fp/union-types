export type TYPE = "type"
export type VALUE = "value"

export interface Variant<Type extends string, Value = unknown> {
    type: Type
    value: Value
}

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

type Void<T, U> = T extends U ? void : never

export interface VariantImpl<
    Var extends Record<TypeKey, string> & Record<ValueKey, unknown>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE
> {
    <Value extends Narrow<Var, Type, TypeKey>[ValueKey]>(
        value: Value | Void<undefined, Narrow<Var, Type, TypeKey>[ValueKey]>,
    ): Record<TypeKey, Type> & Record<ValueKey, Value>
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

export interface InlineVariantImpl<
    Var extends Record<TypeKey, string>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE
> {
    <Value extends Omit<Narrow<Var, Type, TypeKey>, TypeKey>>(
        value: Value | Void<object, Omit<Narrow<Var, Type, TypeKey>, TypeKey>>,
    ): Record<TypeKey, Type> & Omit<Value, TypeKey>
    type: Type
    typeKey: TypeKey
    is: Predicate<Var, Type, TypeKey>
}

export type InlineImpl<Var extends Record<TypeKey, string>, TypeKey extends PropertyKey = TYPE> = {
    [Type in Var[TypeKey]]: InlineVariantImpl<Var, Type, TypeKey>
}

export interface VariantPattern<Var extends object> {
    type: string
    typeKey: keyof Var
    valueKey?: keyof Var
}

export type Pattern<Var extends object> = VariantPattern<Var> | null | undefined

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
    : NarrowPattern<Var, P>

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

declare const matchTuple: TupleMatcher<[Union, Union, Union]>

const t = matchTuple
    .with([Foo, Foo, null], ([foo, bar]) => 42)
    .with([Foo, Bar, null], ([foo, bar]) => 42)
    .with([Bar, null, Bar], ([foo, bar]) => 42)
    .done()

declare const match: Matcher<Union>

const t2 = match
    .with(Foo, foo => foo)
    .with(Bar, foo => foo)
    .done()
