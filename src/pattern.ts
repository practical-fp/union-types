const NARROWED_TYPE = Symbol()

export type NarrowingGuard<Narrowed> = <T>(value: T) => value is Extract<T, Narrowed>

export interface Pattern<Narrowed> extends NarrowingGuard<Narrowed> {
    unwrap<T>(value: T): Extract<T, Narrowed> | undefined
    unwrap<T, U>(value: T, defaultValue: U): Extract<T, Narrowed> | U
    nullable(): Pattern<Narrowed | null>
    optional(): Pattern<Narrowed | undefined>
    /** Used exclusively for Typescript type inference */
    [NARROWED_TYPE]: Narrowed[]
}

export function of<Narrowed>(guard: NarrowingGuard<Narrowed>): Pattern<Narrowed> {
    function pattern<T>(value: T): value is Extract<T, Narrowed> {
        return guard(value)
    }

    pattern.unwrap = <T, U extends Narrowed>(value: T, defaultValue?: U) =>
        pattern(value) ? value : defaultValue

    pattern.nullable = () => union(literal(null), pattern)
    pattern.optional = () => union(literal(undefined), pattern)

    pattern[NARROWED_TYPE] = [] as Narrowed[]

    return pattern
}

export type NarrowedType<P extends Pattern<any>> = P[typeof NARROWED_TYPE][number]

export function union<P extends Pattern<any>, Ps extends ReadonlyArray<Pattern<any>>>(
    pattern: P,
    ...patterns: Ps
) {
    type Narrowed = NarrowedType<P | Ps[number]>
    const _patterns = [pattern, ...patterns]
    return of(<T>(value: T): value is Extract<T, Narrowed> => {
        return _patterns.some(pattern => pattern(value))
    })
}

type IntersectedType<Patterns extends Pattern<any>> = (
    Patterns extends any ? (_: Patterns) => void : never
) extends (_: infer Intersection) => void
    ? Intersection extends Pattern<any>
        ? NarrowedType<Intersection>
        : never
    : never

export function intersection<P extends Pattern<any>, Ps extends ReadonlyArray<Pattern<any>>>(
    pattern: P,
    ...patterns: Ps
) {
    type Narrowed = IntersectedType<P | Ps[number]>
    const _patterns = [pattern, ...patterns]
    return of(<T>(value: T): value is Extract<T, Narrowed> => {
        return _patterns.every(pattern => pattern(value))
    })
}

export type Literal = number | string | symbol | boolean | null | undefined

export function literal<L extends Literal>(literal: L) {
    return of(<T>(value: T): value is Extract<T, L> => {
        return (value as never) === literal
    })
}

export const unknown = of(<T>(value: T): value is T => true)

export function field<Key extends PropertyKey, Narrowed>(
    key: Key,
    pattern: Pattern<Narrowed | undefined>,
): Pattern<{ [_ in Key]?: Narrowed | undefined }>
export function field<Key extends PropertyKey, Narrowed>(
    key: Key,
    pattern: Pattern<Narrowed>,
): Pattern<{ [_ in Key]: Narrowed }>
export function field<Key extends PropertyKey, Narrowed>(key: Key, pattern: Pattern<Narrowed>) {
    return of(<T>(value: T): value is Extract<T, { [_ in Key]: Narrowed }> => {
        return typeof value === "object" && value !== null && pattern((value as never)[key])
    })
}
