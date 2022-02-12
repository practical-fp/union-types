import { Narrow } from "./common"

export type TYPE = "type"
export type VALUE = "value"

export type Predicate<
    Var extends Record<TypeKey, string>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE,
> = (variant: Var) => variant is Narrow<Var, Type, TypeKey>

export type ScopedTagger<
    Type extends string,
    TypeKey extends PropertyKey,
    ValueKey extends PropertyKey,
> = <Value>(value: Value) => Record<TypeKey, Type> & Record<ValueKey, Value>

export type ScopedVariantConstructor<
    Type extends string,
    Value,
    TypeKey extends PropertyKey,
    ValueKey extends PropertyKey,
    Args extends unknown[] = [undefined] extends [Value] ? [Value] | [] : [Value],
> = (...args: Args) => Record<TypeKey, Type> & Record<ValueKey, Value>

export type ScopedVariantImpl<
    Var extends Record<TypeKey, string> & Record<ValueKey, unknown>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey,
    ValueKey extends PropertyKey,
    Constr extends ScopedVariantConstructor<
        Type,
        Narrow<Var, Type, TypeKey>[ValueKey],
        TypeKey,
        ValueKey
    > = ScopedVariantConstructor<Type, Narrow<Var, Type, TypeKey>[ValueKey], TypeKey, ValueKey>,
> = Constr & {
    type: Type
    typeKey: TypeKey
    valueKey: ValueKey
    is: Predicate<Var, Type, TypeKey>
    refine: <RefinedConstr extends Constr>(
        constr: (tagger: ScopedTagger<Type, TypeKey, ValueKey>) => RefinedConstr,
    ) => ScopedVariantImpl<Var, Type, TypeKey, ValueKey, RefinedConstr>
}

export type ScopedImpl<
    Var extends Record<TypeKey, string> & Record<ValueKey, unknown>,
    TypeKey extends PropertyKey = TYPE,
    ValueKey extends PropertyKey = VALUE,
> = {
    [Type in Var[TypeKey]]: ScopedVariantImpl<Var, Type, TypeKey, ValueKey>
}

export type InlineTagger<Type extends string, TypeKey extends PropertyKey> = <Value extends object>(
    value: Value,
) => Record<TypeKey, Type> & Omit<Value, TypeKey>

export type InlineVariantConstructor<
    Type extends string,
    Value extends object,
    TypeKey extends PropertyKey,
    Args extends unknown[] = [object] extends [Value] ? [Value] | [] : [Value],
> = (...args: Args) => Record<TypeKey, Type> & Omit<Value, TypeKey>

export type InlineVariantImpl<
    Var extends Record<TypeKey, string>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey,
    Constr extends InlineVariantConstructor<
        Type,
        Omit<Narrow<Var, Type, TypeKey>, TypeKey>,
        TypeKey
    > = InlineVariantConstructor<Type, Omit<Narrow<Var, Type, TypeKey>, TypeKey>, TypeKey>,
> = Constr & {
    type: Type
    typeKey: TypeKey
    is: Predicate<Var, Type, TypeKey>
    refine: <RefinedConstr extends Constr>(
        constr: (tagger: InlineTagger<Type, TypeKey>) => RefinedConstr,
    ) => InlineVariantImpl<Var, Type, TypeKey, RefinedConstr>
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
