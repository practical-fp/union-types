export interface Variant<Tag extends string = string, Value = unknown> {
    readonly tag: Tag
    readonly value: Value
}

export function tag<Tag extends string>(tag: Tag): Variant<Tag, undefined>
export function tag<Tag extends string, Value>(tag: Tag, value: Value): Variant<Tag, Value>
export function tag(tag: string, value?: unknown): Variant {
    return {
        tag,
        value,
    }
}

export type Tags<Var extends Variant> = Var["tag"]

export type Values<Var extends Variant> = Var["value"]

export type Narrow<Var extends Variant, Tag extends Tags<Var>> = Var extends Variant<
    Tag,
    infer Value
>
    ? Extract<Var, Variant<Tag, Value>>
    : never

export function hasTag<Var extends Variant, Tag extends Tags<Var>>(
    variant: Var,
    tag: Tag,
): variant is Narrow<Var, Tag> {
    return variant.tag === tag
}

export type Predicate<Tag extends string> = <Var extends Variant>(
    variant: Var,
) => variant is Narrow<Var, Tag>

export function predicate<Tag extends string>(tag: Tag): Predicate<Tag> {
    return <Var extends Variant>(variant: Var): variant is Narrow<Var, Tag> => hasTag(variant, tag)
}

export const WILDCARD = Symbol("Match Wildcard")

export type CasesExhaustive<Var extends Variant, Ret> = {
    [Tag in Tags<Var>]: (value: Values<Narrow<Var, Tag>>) => Ret
}

export type CasesWithWildcard<Var extends Variant, Ret> = Partial<CasesExhaustive<Var, Ret>> & {
    [WILDCARD]: () => Ret
}

export type Cases<Var extends Variant, Ret = unknown> =
    | CasesExhaustive<Var, Ret>
    | CasesWithWildcard<Var, Ret>

export type CasesReturn<Var extends Variant, C extends Cases<Var>> = C extends Cases<Var, infer Ret>
    ? Ret
    : never

function containsWildcard<Var extends Variant, Ret>(
    cases: Cases<Var, Ret>,
): cases is CasesWithWildcard<Var, Ret> {
    return WILDCARD in cases
}

export function match<Var extends Variant, C extends Cases<Var>>(
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

export function assertNever(_: never): never {
    throw new Error("Unreachable state reached!")
}