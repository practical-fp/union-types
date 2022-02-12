import {
    InlinedImplOptions,
    InlineImpl,
    InlineTagger,
    InlineVariantConstructor,
    InlineVariantImpl,
    Narrow,
    ScopedImpl,
    ScopedImplOptions,
    ScopedTagger,
    ScopedVariantConstructor,
    ScopedVariantImpl,
    TYPE,
    Variant,
} from "./types"

function scopedVariantImpl<
    Var extends Record<TypeKey, string> & Record<ValueKey, unknown>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey,
    ValueKey extends PropertyKey,
>(
    type: Type,
    typeKey: TypeKey,
    valueKey: ValueKey,
): ScopedVariantImpl<Var, Type, TypeKey, ValueKey> {
    type Narrowed = Narrow<Var, Type, TypeKey>

    const tagger = <Value>(value: Value) =>
        ({ [typeKey]: type, [valueKey]: value } as Record<TypeKey, Type> & Record<ValueKey, Value>)

    function constructor(): Narrowed
    function constructor(value: Narrowed[ValueKey]): Narrowed
    function constructor(value?: Narrowed[ValueKey]) {
        return tagger(value)
    }

    constructor.type = type
    constructor.typeKey = typeKey
    constructor.valueKey = valueKey

    constructor.is = (variant: Var): variant is Narrowed => variant[typeKey] === type

    constructor.refine = <
        RefinedConstr extends ScopedVariantConstructor<Type, Narrowed[ValueKey], TypeKey, ValueKey>,
    >(
        constr: (tagger: ScopedTagger<Type, TypeKey, ValueKey>) => RefinedConstr,
    ): ScopedVariantImpl<Var, Type, TypeKey, ValueKey, RefinedConstr> => {
        const fn = constr(tagger)
    }

    return constructor
}

function inlineVariantImpl<
    Var extends Record<TypeKey, string>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE,
>(type: Type, typeKey: TypeKey): InlineVariantImpl<Var, Type, TypeKey> {
    type Narrowed = Narrow<Var, Type, TypeKey>

    const tagger = <Value extends object>(value: Value) =>
        ({ ...value, [typeKey]: type } as Record<TypeKey, Type> & Omit<Value, TypeKey>)

    function constructor(): Narrowed
    function constructor(value: Omit<Narrowed, TypeKey>): Narrowed
    function constructor(value: object = {}) {
        return tagger(value)
    }

    constructor.type = type
    constructor.typeKey = typeKey

    constructor.is = (variant: Var): variant is Narrow<Var, Type, TypeKey> =>
        variant[typeKey] === type

    constructor.refine = <
        RefinedConstr extends InlineVariantConstructor<Type, Omit<Narrowed, TypeKey>, TypeKey>,
    >(
        constr: (tagger: InlineTagger<Type, TypeKey>) => RefinedConstr,
    ): InlineVariantImpl<Var, Type, TypeKey, RefinedConstr> => {
        const fn = constr(tagger)
    }

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
