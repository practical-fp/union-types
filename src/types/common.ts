export type TYPE = "type"
export type VALUE = "value"

export type Narrow<
    Var extends object,
    Type extends string,
    TypeKey extends PropertyKey = TYPE
> = Extract<Var, Record<TypeKey, Type>>

export type Predicate<
    Var extends Record<TypeKey, string>,
    Type extends Var[TypeKey],
    TypeKey extends PropertyKey = TYPE
> = (variant: Var) => variant is Narrow<Var, Type, TypeKey>

export type Void<T, U> = T extends U ? void : never

export type UnpackTuple<T extends unknown[]> = T extends [infer Head, ...infer Tail]
    ? Head extends any
        ? [Head, ...UnpackTuple<Tail>]
        : never
    : []
