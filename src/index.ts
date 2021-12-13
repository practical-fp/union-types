import { Pattern, select } from "ts-pattern"
import { AnonymousSelectPattern, NamedSelectPattern } from "ts-pattern/lib/types/Pattern"

/**
 * A type which discriminates on {@link type}
 * when used in a union with other instances of this type.
 *
 * @example
 * type Union =
 *     | Variant<"1">
 *     | Variant<"2", number>
 */
export interface Variant<Type extends string, Value = undefined> {
    readonly type: Type
    readonly value: Value
}

/**
 * Utility type which allows any {@link Variant} to be assigned to it.
 */
export type AnyVariant = Variant<string, unknown>

/**
 * Creates a new {@link Variant} instance whose value is undefined.
 * @param type
 */
export function variant<Type extends string>(type: Type): Variant<Type>

/**
 * Creates a new {@link Variant} instance.
 * @param type
 * @param value
 */
export function variant<Type extends string, Value>(type: Type, value: Value): Variant<Type, Value>
export function variant(type: string, value?: unknown): AnyVariant {
    return {
        type,
        value,
    }
}

/**
 * Utility type for extracting the possible values for {@link Variant#type}
 * from a union of {@link Variant}s.
 *
 * @example
 * type Union =
 *     | Variant<"1">
 *     | Variant<"2">
 *
 * // Equals: "1" | "2"
 * type UnionTags = Types<Union>
 */
export type Types<Var extends AnyVariant> = Var["type"]

/**
 * Utility type for extracting the possible types for {@link Variant#value}
 * from a union of {@link Variant}s.
 *
 * @example
 * type Union =
 *     | Variant<"1", string>
 *     | Variant<"2", number>
 *
 * // Equals: string | number
 * type UnionValues = Values<Union>
 */
export type Values<Var extends AnyVariant> = Var["value"]

/**
 * Utility type for narrowing down a union of {@link Variant}s based on their tags.
 *
 * @example
 * type Union =
 *     | Variant<"1", 1>
 *     | Variant<"2", 2>
 *     | Variant<"3", 3>
 *
 * // Equals: Variant<"1", 1> | Variant<"3", 3>
 * type Narrowed = Narrow<Union, "1" | "3">
 */
export type Narrow<Var extends AnyVariant, Tag extends Types<Var>> = Extract<
    Var,
    Variant<Tag, unknown>
>

/**
 * Type guard for narrowing down the type of a {@link Variant}.
 * @param variant
 * @param type
 * @example
 * type Union =
 *     | Variant<"1", number>
 *     | Variant<"2", string>
 *
 * function doSomething(union: Union) {
 *     // union.value has type number | string
 *
 *     if (hasType(union, "1")) {
 *         // union.value has type number now
 *     }
 * }
 */
export function hasType<Var extends AnyVariant, Type extends Types<Var>>(
    variant: Var,
    type: Type,
): variant is Narrow<Var, Type> {
    return variant.type === type
}

/**
 * Type of a function which narrows down the type of a given {@link Variant}.
 */
export type Predicate<Type extends string> = <Var extends AnyVariant>(
    variant: Var,
) => variant is Narrow<Var, Type>

/**
 * Factory function for creating a type guard which narrows down the type of a {@link Variant}.
 * @param type
 * @example
 * type Union =
 *     | Variant<"1", number>
 *     | Variant<"2", string>
 *
 * function doSomething(list: Union[]) {
 *     // filtered has type Variant<"1", number>[]
 *     const filtered = list.filter(predicate("1"))
 * }
 */
export function predicate<Type extends string>(type: Type): Predicate<Type> {
    return <Var extends AnyVariant>(variant: Var): variant is Narrow<Var, Type> =>
        hasType(variant, type)
}

export interface VariantImpl<Type extends string, Value> {
    <T extends Value>(value: Value extends undefined ? void : T): Variant<Type, T>
    type: Type
    is: Predicate<Type>
    pattern<P extends Pattern<Value>>(pattern: P): Variant<Type, P>
    select(): Variant<Type, AnonymousSelectPattern>
    select<Key extends string>(key: Key): Variant<Type, NamedSelectPattern<Key>>
}

export function variantImpl<Var extends AnyVariant, Type extends Types<Var>>(
    type: Type,
): VariantImpl<Type, Values<Narrow<Var, Type>>> {
    function constructor<T>(value: T) {
        return variant(type, value)
    }

    function pattern<P extends Pattern<unknown>>(pattern: P) {
        return variant(type, pattern)
    }

    function selectPattern(): Variant<Type, AnonymousSelectPattern>
    function selectPattern<Key extends string>(key: Key): Variant<Type, NamedSelectPattern<Key>>
    function selectPattern<Key extends string>(key?: Key) {
        return pattern(key ? select(key) : select())
    }

    constructor.type = type
    constructor.is = predicate(type)
    constructor.pattern = pattern
    constructor.select = selectPattern
    return constructor
}

/**
 * Type which specifies constructors and type guards for a variant type.
 */
export type Impl<Var extends AnyVariant> = {
    [Tag in Types<Var>]: VariantImpl<Tag, Values<Narrow<Var, Tag>>>
}

/**
 * Function for generating an implementation for the given variants.
 *
 * In case the variant type uses unconstrained generics,
 * pass unknown as its type arguments.
 *
 * In case the variant type uses constrained generics,
 * pass the constraint type as its type arguments.
 *
 * @example
 * type Result<T, E> =
 *     | Variant<"Ok", T>
 *     | Variant<"Err", E>
 *
 * const {Ok, Err} = impl<Result<unknown, unknown>>()
 *
 * let result: Result<number, string>
 * result = Ok(42)
 * result = Err("Something went wrong")
 *
 * Ok.is(result)  // false
 * Err.is(result)  // true
 *
 * Ok.type  // "Ok"
 * Err.type  // "Err"
 */
export function impl<Var extends AnyVariant>(): Impl<Var> {
    return new Proxy({} as Impl<Var>, {
        get: (_, type: string) => {
            return variantImpl(type)
        },
    })
}
