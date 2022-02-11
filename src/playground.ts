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

export interface VariantConstructor<
    Type extends string,
    Value,
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE
> {
    <T extends Value>(value: T | Void<undefined, Value>): Record<TypeKey, Type> &
        Record<ValueKey, T>
}

export interface VariantImpl<
    Var extends Record<TypeKey, string> & Record<ValueKey, unknown>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE
> extends VariantConstructor<Type, Narrow<Var, Type, TypeKey>[ValueKey], TypeKey, ValueKey> {
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

export interface InlineVariantConstructor<
    Type extends string,
    Value extends object,
    TypeKey extends PropertyKey = TYPE
> {
    <T extends Value>(value: T | Void<object, Value>): Record<TypeKey, Type> & Omit<T, TypeKey>
}

export interface InlineVariantImpl<
    Var extends Record<TypeKey, string>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE
> extends InlineVariantConstructor<Type, Omit<Narrow<Var, Type, TypeKey>, TypeKey>, TypeKey> {
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

function variantImpl<
    Var extends Record<TypeKey, string> & Record<ValueKey, unknown>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey,
    ValueKey extends PropertyKey
>(type: Type, typeKey: TypeKey, valueKey: ValueKey): VariantImpl<Var, Type, TypeKey, ValueKey> {
    type Value = Narrow<Var, Type, TypeKey>[ValueKey]
    const constructor = <T extends Value>(value: T | Void<undefined, Value>) =>
        ({ [typeKey]: type, [valueKey]: value } as Record<TypeKey, Type> & Record<ValueKey, T>)

    constructor.type = type
    constructor.typeKey = typeKey
    constructor.valueKey = valueKey

    constructor.is = (variant: Var): variant is Narrow<Var, Type, TypeKey> =>
        variant[typeKey] === type

    return constructor
}

function inlineVariantImpl<
    Var extends Record<TypeKey, string>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE
>(type: Type, typeKey: TypeKey): InlineVariantImpl<Var, Type, TypeKey> {
    type Value = Omit<Narrow<Var, Type, TypeKey>, TypeKey>
    const constructor = <T extends Value>(value: T | Void<object, Value>) =>
        ({ ...(value as object), [typeKey]: type } as Record<TypeKey, Type> & Omit<T, TypeKey>)

    constructor.type = type
    constructor.typeKey = typeKey

    constructor.is = (variant: Var): variant is Narrow<Var, Type, TypeKey> =>
        variant[typeKey] === type

    return constructor
}

interface CustomizedImplOptions<TypeKey extends PropertyKey, ValueKey extends PropertyKey> {
    typeKey: TypeKey
    valueKey: ValueKey
    inline?: false
}

interface InlinedImplOptions<TypeKey extends PropertyKey> {
    typeKey: TypeKey
    inline: true
}

export function customizedImpl<TypeKey extends PropertyKey, ValueKey extends PropertyKey>(
    options: CustomizedImplOptions<TypeKey, ValueKey>,
): <Var extends Record<TypeKey, string> & Record<ValueKey, unknown>>() => Impl<
    Var,
    TypeKey,
    ValueKey
>
export function customizedImpl<TypeKey extends PropertyKey>(
    options: InlinedImplOptions<TypeKey>,
): <Var extends Record<TypeKey, string>>() => InlineImpl<Var, TypeKey>
export function customizedImpl(
    options: CustomizedImplOptions<PropertyKey, PropertyKey> | InlinedImplOptions<PropertyKey>,
): () => Impl<never, never, never> | InlineImpl<never, never> {
    if (options.inline) {
        const { typeKey } = options
        return () => new Proxy({}, { get: (_, type: string) => inlineVariantImpl(type, typeKey) })
    }
    const { typeKey, valueKey } = options
    return () => new Proxy({}, { get: (_, type: string) => variantImpl(type, typeKey, valueKey) })
}

export function impl<Var extends Variant<string>>(): Impl<Var> {
    return customizedImpl({ typeKey: "type", valueKey: "value" })()
}

type Union = Variant<"Foo", string> | Variant<"Bar", number>

const { Foo, Bar } = impl<Union>()

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
