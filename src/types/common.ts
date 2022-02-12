export type Narrow<Var, Type extends Var[TypeKey], TypeKey extends keyof Var> = Extract<
    Var,
    Record<TypeKey, Type>
>

export type Void<T, U> = [T] extends [U] ? void : never

export type UnpackTuple<T extends unknown[]> = T extends [infer Head, ...infer Tail]
    ? Head extends any
        ? [Head, ...UnpackTuple<Tail>]
        : never
    : []
