# Union Types

[![NPM version badge](https://badgen.net/npm/v/@practical-fp/union-types)](https://npmjs.org/package/@practical-fp/union-types)
[![Bundle size badge](https://badgen.net/bundlephobia/minzip/@practical-fp/union-types)](https://bundlephobia.com/result?p=@practical-fp/union-types)
[![Dependency count badge](https://badgen.net/bundlephobia/dependency-count/@practical-fp/union-types)](https://bundlephobia.com/result?p=@practical-fp/union-types)
[![Tree shaking support badge](https://badgen.net/bundlephobia/tree-shaking/@practical-fp/union-types)](https://bundlephobia.com/result?p=@practical-fp/union-types)
![License badge](https://img.shields.io/npm/l/@practical-fp/union-types)

A Typescript library for creating discriminating union types. Requires Typescript 4.2 or higher.

[Typescript Handbook on discriminating union types](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)

## Example

```typescript
import { impl, Variant, match } from "@practical-fp/union-types"

type Shape =
    | Variant<"Circle", { radius: number }>
    | Variant<"Square", { sideLength: number }>

const { Circle, Square } = impl<Shape>()

function getArea(shape: Shape) {
    return match(shape)
        .with(Circle, ({ radius }) => Math.PI * radius ** 2)
        .with(Square, ({ sideLength }) => sideLength ** 2)
        .done()
}

const circle = Circle({ radius: 5 })
const area = getArea(circle)
```

## Installation

```bash
$ npm install @practical-fp/union-types ts-pattern
```

## Usage

### Defining a discriminating union type

```typescript
import { Variant } from "@practical-fp/union-types"

type Shape =
    | Variant<"Circle", { radius: number }>
    | Variant<"Square", { sideLength: number }>
```

This is equivalent to the following type:

```typescript
type Shape =
    | { type: "Circle", value: { radius: number } }
    | { type: "Square", value: { sideLength: number } }
```

### Creating an implementation

```typescript
import { impl } from "@practical-fp/union-types"

const { Circle, Square } = impl<Shape>()
```

`impl<>()` can only be used if your environment has full support
for [Proxies](https://caniuse.com/?search=Proxy). Alternatively, use the `constructor<>()` function.

`Circle.is` and `Square.is` can be used to check if a shape is a circle or a square.
They also act as a type guard.

```typescript
const shapes: Shape[] = [circle, square]
const sideLengths = shapes.filter(Square.is).map(square => square.value.sideLength)
```

### Generics
`impl<>()` also supports generic union types.

In case the variant type uses unconstrained generics, 
`unknown` needs to be passed as its type arguments.

```typescript
import { impl, Variant } from "@practical-fp/union-types"

type Result<T, E> =
    | Variant<"Ok", T>
    | Variant<"Err", E>

const { Ok, Err } = impl<Result<unknown, unknown>>()
```

In case the variant type uses constrained generics,
the constraint type needs to be passed as its type arguments.

```typescript
import { impl, Variant } from "@practical-fp/union-types"

type Result<T extends object, E> =
    | Variant<"Ok", T>
    | Variant<"Err", E>

const { Ok, Err } = impl<Result<object, unknown>>()
```
