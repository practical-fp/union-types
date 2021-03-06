/**
 * A type which discriminates on {@link tag}
 * when used in a union with other instances of this type.
 *
 * @example
 * type Union =
 *     | Variant<"1">
 *     | Variant<"2", number>
 */
export interface Variant<Tag extends string = string, Value = undefined> {
    readonly tag: Tag
    readonly value: Value
}

/**
 * Utility type which allows any {@link Variant} to be assigned to it.
 */
export type AnyVariant = Variant<string, unknown>

/**
 * Creates a new {@link Variant} instance whose value is undefined.
 * @param tag
 */
export function tag<Tag extends string>(tag: Tag): Variant<Tag>

/**
 * Creates a new {@link Variant} instance.
 * @param tag
 * @param value
 */
export function tag<Tag extends string, Value>(tag: Tag, value: Value): Variant<Tag, Value>
export function tag(tag: string, value?: unknown): AnyVariant {
    return {
        tag,
        value,
    }
}

/**
 * Extracts the value form a @link Variant} instance.
 * @param variant
 */
export function untag<Value>(variant: Variant<string, Value>): Value {
    return variant.value
}

/**
 * Utility type for extracting the possible values for {@link Variant#tag}
 * from a union of {@link Variant}s.
 *
 * @example
 * type Union =
 *     | Variant<"1">
 *     | Variant<"2">
 *
 * // Equals: "1" | "2"
 * type UnionTags = Tags<Union>
 */
export type Tags<Var extends AnyVariant> = Var["tag"]

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
export type Narrow<Var extends AnyVariant, Tag extends Tags<Var>> = Extract<
    Var,
    Variant<Tag, unknown>
>

/**
 * Type guard for narrowing down the type of a {@link Variant}.
 * @param variant
 * @param tag
 * @example
 * type Union =
 *     | Variant<"1", number>
 *     | Variant<"2", string>
 *
 * function doSomething(union: Union) {
 *     // union.value has type number | string
 *
 *     if (hasTag(union, "1")) {
 *         // union.value has type number now
 *     }
 * }
 */
export function hasTag<Var extends AnyVariant, Tag extends Tags<Var>>(
    variant: Var,
    tag: Tag,
): variant is Narrow<Var, Tag> {
    return variant.tag === tag
}

/**
 * Type of a function which narrows down the type of a given {@link Variant}.
 */
export type Predicate<Tag extends string> = <Var extends AnyVariant>(
    variant: Var,
) => variant is Narrow<Var, Tag>

/**
 * Factory function for creating a type guard which narrows down the type of a {@link Variant}.
 * @param tag
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
export function predicate<Tag extends string>(tag: Tag): Predicate<Tag> {
    return <Var extends AnyVariant>(variant: Var): variant is Narrow<Var, Tag> =>
        hasTag(variant, tag)
}

/**
 * Symbol for declaring a wildcard case in a {@link match} expression.
 */
export const WILDCARD = Symbol("Match Wildcard")

/**
 * Utility type for ensuring that a {@link matchExhaustive} expression covers all cases.
 */
export type CasesExhaustive<Var extends AnyVariant, Ret = unknown> = {
    [Tag in Tags<Var>]: (value: Values<Narrow<Var, Tag>>) => Ret
}

/**
 * Utility type for enabling a {@link matchWildcard} expression to cover only some cases,
 * as long as, a wildcard case is declared for matching the remaining cases.
 */
export type CasesWildcard<Var extends AnyVariant, Ret = unknown> = Partial<
    CasesExhaustive<Var, Ret>
> & { [WILDCARD]: () => Ret }

/**
 * Utility type for ensuring that a {@link match} expression either covers all cases,
 * or contains a wildcard for matching the remaining cases.
 */
export type Cases<Var extends AnyVariant, Ret = unknown> =
    | CasesExhaustive<Var, Ret>
    | CasesWildcard<Var, Ret>

/**
 * Utility type for inferring the return type of a {@link match} expression.
 */
export type CasesReturn<Var extends AnyVariant, C extends Cases<Var>> = C extends Cases<
    Var,
    infer Ret
>
    ? Ret
    : never

/**
 * Internal helper type which accepts any Cases object.
 */
interface AnyCases {
    [tag: string]: ((value: unknown) => unknown) | undefined
    [WILDCARD]?: () => unknown
}

/**
 * Function for matching on the tag of a {@link Variant}.
 * All possible cases need to be covered, unless a wildcard case is present.
 * @param variant
 * @param cases
 * @example
 * type Union =
 *     | Variant<"Num", number>
 *     | Variant<"Str", string>
 *     | Variant<"Bool", boolean>
 *
 * function doSomething(union: Union) {
 *     return match(union, {
 *         Num: number => number * number,
 *         Str: string => `Hello, ${string}!`,
 *         Bool: boolean => !boolean,
 *     })
 * }
 *
 * function doSomethingElse(union: Union) {
 *     return match(union, {
 *         Str: string => `Hello, ${string}!`,
 *         [WILDCARD]: () => "Hello there!",
 *     })
 * }
 * @deprecated Use {@link matchExhaustive} or {@link matchWildcard} instead.
 */
export function match<Var extends AnyVariant, C extends Cases<Var>>(
    variant: Var,
    cases: C,
): CasesReturn<Var, C>
export function match(variant: AnyVariant, cases: AnyCases): unknown {
    const caseFn = cases[variant.tag]
    if (caseFn) {
        return caseFn(variant.value)
    }
    const wildcardFn = cases[WILDCARD]
    if (wildcardFn) {
        return wildcardFn()
    }
    throw new Error(`No case matched tag ${tag}.`)
}

/**
 * Helper type to restrict the possible keys of a type.
 *
 * This is useful for {@link matchExhaustive} and {@link matchWildcard} where the cases argument
 * needs to be generic to infer the correct return type.
 * However, due to the argument being generic it is allowed to pass extra properties.
 * Passing extra arguments is probably a spelling mistake.
 * Therefore, we restrict the properties by setting extra properties to never.
 *
 * Typescript 4.2 will show a nice hint asking whether you've misspelled the property name.
 */
export type ValidateProperties<T, AllowedProperties extends keyof T> = {
    [_ in Exclude<keyof T, AllowedProperties>]: never
}

/**
 * Function for matching on the tag of a {@link Variant}.
 * All possible cases need to be covered.
 * @param variant
 * @param cases
 * @example
 * type Union =
 *     | Variant<"Num", number>
 *     | Variant<"Str", string>
 *     | Variant<"Bool", boolean>
 *
 * function doSomething(union: Union) {
 *     return matchExhaustive(union, {
 *         Num: number => number * number,
 *         Str: string => `Hello, ${string}!`,
 *         Bool: boolean => !boolean,
 *     })
 * }
 */
export function matchExhaustive<Var extends AnyVariant, Cases extends CasesExhaustive<Var>>(
    variant: Var,
    cases: Cases & ValidateProperties<Cases, keyof CasesExhaustive<Var>>,
): CasesReturn<Var, Cases> {
    return match(variant, cases)
}

/**
 * Function for matching on the tag of a {@link Variant}.
 * Not all cases need to be covered, a wildcard case needs to be present.
 * @param variant
 * @param cases
 * @example
 * type Union =
 *     | Variant<"Num", number>
 *     | Variant<"Str", string>
 *     | Variant<"Bool", boolean>
 *
 * function doSomething(union: Union) {
 *     return matchWildcard(union, {
 *         Str: string => `Hello, ${string}!`,
 *         [WILDCARD]: () => "Hello there!",
 *     })
 * }
 */
export function matchWildcard<Var extends AnyVariant, Cases extends CasesWildcard<Var>>(
    variant: Var,
    cases: Cases & ValidateProperties<Cases, keyof CasesWildcard<Var>>,
): CasesReturn<Var, Cases> {
    return match(variant, cases)
}

/**
 * Utility function for asserting that all cases have been covered.
 * @param variant
 * @example
 * type Union =
 *     | Variant<"1", string>
 *     | Variant<"2", number>
 *
 * function doSomething(union: Union) {
 *     switch(union.tag) {
 *         case "1":
 *             alert(union.value)
 *             break
 *         case "2":
 *             alert(union.value.toFixed(0))
 *             break
 *         default:
 *             // compile error if we've forgotten a case
 *             assertNever(union)
 *     }
 * }
 */
export function assertNever(variant: never): never {
    throw new Error("Unreachable state reached!")
}

/**
 * Type which specifies the constructor for a variant type.
 */
export type Constructor<Tag extends string, Value> = <T extends Value>(
    value: Value extends undefined ? T | void : T,
) => Variant<Tag, T>

/**
 * Type which specifies the strict constructor for a variant type.
 * It does not support generics.
 */
export type StrictConstructor<Tag extends string, Value> = (
    value: Value extends undefined ? Value | void : Value,
) => Variant<Tag, Value>

/**
 * Type which specifies the extra properties which are attached to a constructor.
 */
export interface ConstructorExtra<Tag extends string> {
    tag: Tag
    is: Predicate<Tag>
}

/**
 * Type which specifies the constructor for a variant type with attached type guard.
 */
export type ConstructorWithExtra<Tag extends string, Value> = Constructor<Tag, Value> &
    ConstructorExtra<Tag>

/**
 * Type which specifies the strict constructor for a variant type with attached type guard.
 * It does not support generics.
 */
export type StrictConstructorWithExtra<Tag extends string, Value> = StrictConstructor<Tag, Value> &
    ConstructorExtra<Tag>

/**
 * Function for creating a constructor for the given variant.
 *
 * In case the variant type uses unconstrained generics,
 * pass unknown as its type arguments.
 *
 * In case the variant type uses constrained generics,
 * pass the constraint type as its type arguments.
 *
 * Use {@link impl} instead if your environment has support for {@link Proxy}.
 *
 * @example
 * type Result<T, E> =
 *     | Variant<"Ok", T>
 *     | Variant<"Err", E>
 *
 * const Ok = constructor<Result<unknown, unknown>, "Ok">("Ok")
 * const Err = constructor<Result<unknown, unknown>, "Err">("Err")
 *
 * let result: Result<number, string>
 * result = Ok(42)
 * result = Err("Something went wrong")
 *
 * Ok.is(result)  // false
 * Err.is(result)  // true
 *
 * Ok.tag  // "Ok"
 * Err.tag  // "Err"
 */
export function constructor<Var extends AnyVariant, Tag extends Tags<Var>>(
    tagName: Tag,
): ConstructorWithExtra<Tag, Values<Narrow<Var, Tag>>> {
    function constructor<T>(value: T) {
        return tag(tagName, value)
    }

    constructor.tag = tagName
    constructor.is = predicate(tagName)
    return constructor
}

/**
 * Same as {@link constructor}, but does not support generics.
 * @param tagName
 */
export function strictConstructor<Var extends AnyVariant, Tag extends Tags<Var>>(
    tagName: Tag,
): StrictConstructorWithExtra<Tag, Values<Narrow<Var, Tag>>> {
    return constructor(tagName)
}

/**
 * Type which specifies constructors and type guards for a variant type.
 */
export type Impl<Var extends AnyVariant> = {
    [Tag in Tags<Var>]: ConstructorWithExtra<Tag, Values<Narrow<Var, Tag>>>
}

/**
 * Type which specifies strict constructors and type guards for a variant type.
 * It does not support generics.
 */
export type StrictImpl<Var extends AnyVariant> = {
    [Tag in Tags<Var>]: StrictConstructorWithExtra<Tag, Values<Narrow<Var, Tag>>>
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
 * Ok.tag  // "Ok"
 * Err.tag  // "Err"
 */
export function impl<Var extends AnyVariant>(): Impl<Var> {
    return new Proxy({} as Impl<Var>, {
        get: <Tag extends keyof Impl<Var>>(_: Impl<Var>, tagName: Tag) => {
            return constructor<Var, Tag>(tagName)
        },
    })
}

/**
 * Same as {@link impl}, but does not support generics.
 */
export function strictImpl<Var extends AnyVariant>(): StrictImpl<Var> {
    return impl()
}
