import { Narrow, Predicate, TYPE, VALUE, Void } from "./common"

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
