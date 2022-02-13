import {
    InlinedImplOptions,
    InlineImpl,
    InlineVariantImpl,
    Narrow,
    ScopedImpl,
    ScopedImplOptions,
    ScopedVariantImpl,
    TYPE,
    Variant,
    Void,
} from "./types"

function scopedVariantImpl<
    Var extends Record<TypeKey, string> & Record<ValueKey, unknown>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey,
    ValueKey extends PropertyKey
>(
    type: Type,
    typeKey: TypeKey,
    valueKey: ValueKey,
): ScopedVariantImpl<Var, Type, TypeKey, ValueKey> {
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

export function implFactory<TypeKey extends PropertyKey, ValueKey extends PropertyKey>(
    options: ScopedImplOptions<TypeKey, ValueKey>,
): <Var extends Record<TypeKey, string> & Record<ValueKey, unknown>>() => ScopedImpl<
    Var,
    TypeKey,
    ValueKey
>
export function implFactory<TypeKey extends PropertyKey>(
    options: InlinedImplOptions<TypeKey>,
): <Var extends Record<TypeKey, string>>() => InlineImpl<Var, TypeKey>
export function implFactory(
    options: ScopedImplOptions<PropertyKey, PropertyKey> | InlinedImplOptions<PropertyKey>,
): () => ScopedImpl<never, never, never> | InlineImpl<never, never> {
    if (options.inline) {
        const { typeKey } = options
        return () => new Proxy({}, { get: (_, type: string) => inlineVariantImpl(type, typeKey) })
    }
    const { typeKey, valueKey } = options
    return () =>
        new Proxy({}, { get: (_, type: string) => scopedVariantImpl(type, typeKey, valueKey) })
}

export function impl<Var extends Variant<string>>(): ScopedImpl<Var> {
    return implFactory({ typeKey: "type", valueKey: "value" })()
}
