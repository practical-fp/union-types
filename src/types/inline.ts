import { Narrow, Predicate, TYPE, Void } from "./common"

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
