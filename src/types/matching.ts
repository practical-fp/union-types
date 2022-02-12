import { Narrow, UnpackTuple, Void } from "./common"

export interface Pattern<Var extends object> {
    type: string
    typeKey: keyof Var
    valueKey?: keyof Var
}

export type OptionalPattern<Var extends object> = Pattern<Var> | null | undefined

export type NarrowPattern<Var extends object, P extends OptionalPattern<Var>> = P extends {
    type: infer Type
    typeKey: infer TypeKey
}
    ? Narrow<Var, Type & string, TypeKey & PropertyKey>
    : Var

export type PatternValue<Var extends object, P extends OptionalPattern<Var>> = P extends {
    valueKey: infer ValueKey
}
    ? NarrowPattern<Var, P>[ValueKey & keyof Var]
    : NarrowPattern<Var, P>

export interface Matcher<Var extends object, Result = never, Handled extends Var = never> {
    with<P extends OptionalPattern<Var>, HandlerReturn>(
        pattern: P,
        handler: (value: PatternValue<Var, P>) => HandlerReturn,
    ): Matcher<Var, Result | HandlerReturn, Handled | NarrowPattern<Var, P>>

    done<HandlerReturn = never>(
        otherwise: ((variant: Var) => HandlerReturn) | Void<Var, Handled>,
    ): Result | HandlerReturn
}

export type TuplePattern<Vars extends object[]> = {
    [Idx in keyof Vars]: OptionalPattern<Vars[Idx & number]>
}

export type NarrowTuplePattern<Vars extends object[], P extends TuplePattern<Vars>> = {
    [Idx in keyof Vars]: NarrowPattern<Vars[Idx & number], P[Idx]>
}

export type TuplePatternValue<Vars extends object[], P extends TuplePattern<Vars>> = {
    [Idx in keyof Vars]: PatternValue<Vars[Idx & number], P[Idx]>
}

export interface TupleMatcher<Vars extends object[], Result = never, Handled extends Vars = never> {
    with<P extends TuplePattern<Vars>, HandlerReturn>(
        patterns: P,
        handler: (values: TuplePatternValue<Vars, P>) => HandlerReturn,
    ): TupleMatcher<Vars, Result | HandlerReturn, Handled | NarrowTuplePattern<Vars, P>>

    done<HandlerReturn = never>(
        otherwise: ((variants: Vars) => HandlerReturn) | Void<UnpackTuple<Vars>, Handled>,
    ): Result | HandlerReturn
}
