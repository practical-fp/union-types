import { Narrow, Void } from "./common"

export type TYPE = "type"
export type VALUE = "value"

export type Predicate<
    Var extends Record<TypeKey, string>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE
> = (variant: Var) => variant is Narrow<Var, Type, TypeKey>

export interface ScopedVariantConstructor<
    Type extends string,
    Value,
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE
> {
    <T extends Value>(value: T | Void<undefined, Value>): Record<TypeKey, Type> &
        Record<ValueKey, T>
}

export interface ScopedVariantImpl<
    Var extends Record<TypeKey, string> & Record<ValueKey, unknown>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE
> extends ScopedVariantConstructor<Type, Narrow<Var, Type, TypeKey>[ValueKey], TypeKey, ValueKey> {
    type: Type
    typeKey: TypeKey
    valueKey: ValueKey
    is: Predicate<Var, Type, TypeKey>
}

export type ScopedImpl<
    Var extends Record<TypeKey, string> & Record<ValueKey, unknown>,
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE
> = {
    [Type in Var[TypeKey]]: ScopedVariantImpl<Var, Type, TypeKey, ValueKey>
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

export interface ScopedImplOptions<TypeKey extends PropertyKey, ValueKey extends PropertyKey> {
    typeKey: TypeKey
    valueKey: ValueKey
    inline?: false
}

export interface InlinedImplOptions<TypeKey extends PropertyKey> {
    typeKey: TypeKey
    inline: true
}

export interface Variant<Type extends string, Value = unknown> {
    type: Type
    value: Value
}
