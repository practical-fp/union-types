# `@practical-fp/union-types`
A Typescript library for creating discriminating union types.

[Typescript Handbook on discriminating union types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions)

## Installation
```bash
$ npm install @practical-fp/union-types
```
[![NPM](https://nodei.co/npm/@practical-fp/union-types.png)](https://npmjs.org/package/@practical-fp/union-types)

## Examples

### Basic Example
```typescript
import { impl, Variant } from "@practical-fp/union-types"

type Result<T, E> =
    | Variant<"Ok", T>
    | Variant<"Err", E>

const {Ok, Err} = impl<Result<unknown, unknown>>()

let result: Result<number, string>
result = Ok(42)
result = Err("Something went wrong")

Ok.is(result)  // false
Err.is(result)  // true

Ok.tag  // "Ok"
Err.tag  // "Err"
```


### Typescript Handbook Example
```typescript
import { match, Variant } from "@practical-fp/union-types"

type NetworkFailedState = {
    code: number
}

type NetworkSuccessState = {
    title: string
    duration: number
    summary: string
}

type NetworkState =
    | Variant<"Loading">
    | Variant<"Failed", NetworkFailedState>
    | Variant<"Success", NetworkSuccessState>

function logger(state: NetworkState): string {
    return match(state, {
        Loading: () => "Downloading...",
        Failed: ({code}) => `Error ${code} downloading`,
        Success: ({title, summary}) => `Downloaded ${title} - ${summary}`
    })
}
```

### Using wildcard in `match` expression
```typescript
import { match, Variant, WILDCARD } from "@practical-fp/union-types"

type Status =
    | Variant<"Loading">
    | Variant<"Error">
    | Variant<"Success">

function getStatusMessage(status: Status): string {
    return match(status, {
        Error: () => "Something went wrong.",
        [WILDCARD]: () => "Everything is fine.",
    })
}
```

### Filtering arrays using type guards
```typescript
import { impl, Variant } from "@practical-fp/union-types"

type Number = 
    | Variant<"Preformatted", string> 
    | Variant<"Unformatted", number>

const {Preformatted, Unformatted} = impl<Number>()

// inferred return type is Variant<"Preformatted", string>[]
function filterPreformatted(numbers: Number[]) {
    return numbers.filter(Preformatted.is)
}
```

### Usage with `switch` statement
```typescript
import { assertNever, Variant } from "@practical-fp/union-types"

type Number =
    | Variant<"Preformatted", string>
    | Variant<"Unformatted", number>

function alertNumber(number: Number): void {
    switch(number.tag) {
        case "Preformatted":
            // number.value has type string
            alert(number.value)
            break
        case "Unformatted":
            // number.value has type number
            alert(number.value.toFixed(0))
            break
        default:
            // compile error if we've forgotten a case
            assertNever(number)
    }
}
```
