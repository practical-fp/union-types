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
export type Narrow<Var extends AnyVariant, Tag extends Tags<Var>> = Var extends Variant<
    Tag,
    infer Value
>
    ? Extract<Var, Variant<Tag, Value>>
    : never

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
 * Internal type for ensuring that a {@link match} expression covers all cases.
 */
type CasesExhaustive<Var extends AnyVariant, Ret> = {
    [Tag in Tags<Var>]: (value: Values<Narrow<Var, Tag>>) => Ret
}

/**
 * Internal type for enabling a {@link match} expression to cover only some cases,
 * as long as, a wildcard case is declared for matching the remaining cases.
 */
type CasesWithWildcard<Var extends AnyVariant, Ret> = Partial<CasesExhaustive<Var, Ret>> & {
    [WILDCARD]: () => Ret
}

/**
 * Utility type for ensuring that a {@link match} expression either covers all cases,
 * or contains a wildcard for matching the remaining cases.
 */
export type Cases<Var extends AnyVariant, Ret = unknown> =
    | CasesExhaustive<Var, Ret>
    | CasesWithWildcard<Var, Ret>

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
 * Internal utility function for checking if a {@link match} expression contains a wildcard.
 * @param cases
 */
function containsWildcard<Var extends AnyVariant, Ret>(
    cases: Cases<Var, Ret>,
): cases is CasesWithWildcard<Var, Ret> {
    return WILDCARD in cases
}

/**
 * Function for matching on the tag of a {@link Variant}. All possible cases need to be covered,
 * unless a wildcard case it present.
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
 */
export function match<Var extends AnyVariant, C extends Cases<Var>>(
    variant: Var,
    cases: C,
): CasesReturn<Var, C> {
    const tag: Tags<Var> = variant.tag
    if (tag in cases && cases[tag]) {
        return (cases[tag] as Function)(variant.value)
    } else if (containsWildcard(cases)) {
        return (cases[WILDCARD] as Function)()
    }
    throw new Error(`No case matched tag ${variant.tag}.`)
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

export type Constructor<Tag extends string, Value> = unknown extends Value
    ? <T>(value: T) => Variant<Tag, T>
    : Value extends undefined
    ? () => Variant<Tag>
    : (value: Value) => Variant<Tag, Value>

export type ConstructorWithExtra<Tag extends string, Value> = Constructor<Tag, Value> & {
    tag: Tag
    is: Predicate<Tag>
}

export type Impl<Var extends AnyVariant> = {
    [Tag in Tags<Var>]: ConstructorWithExtra<Tag, Values<Narrow<Var, Tag>>>
}

export function impl<Var extends AnyVariant>(): Impl<Var> {
    return new Proxy({} as Impl<Var>, {
        get: (_, tagName: string): ConstructorWithExtra<string, unknown> => {
            const constructor = <T>(value: T) => tag(tagName, value)
            constructor.tag = tagName
            constructor.is = predicate(tagName)
            return constructor
        },
    })
}
