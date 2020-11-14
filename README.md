# `union-types`
A Typescript library for creating discriminating union types.

[Typescript Handbook on discriminating union types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions)

## Installation
```bash
$ npm install union-types
```

## Examples
### Typescript Handbook Example
```typescript
import { match, Variant } from "union-types"

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
import { match, Variant, WILDCARD } from "union-types"

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

### Java Optional Type (Generics)
```typescript
import { match, predicate, tag, Variant } from "union-types"

type Nullable<T> = T | undefined | null

type Optional<T> = 
    | Variant<"Present", T> 
    | Variant<"Empty">

namespace Optional {
    export const isPresent = predicate("Present")
    export const isEmpty = predicate("Empty")

    export function empty(): Optional<never> {
        return tag("Empty")
    }

    export function of<T>(value: T): Optional<T> {
        return tag("Present", value)
    }

    export function ofNullable<T>(value: Nullable<T>): Optional<T> {
        if (value === undefined || value === null) {
            return empty()
        } else {
            return of(value)
        }
    }

    export function get<T>(optional: Optional<T>): T {
        if (isPresent(optional)) {
            return optional.value
        }
        throw new Error("No such element.")
    }

    export function orElse<T>(optional: Optional<T>, other: T): T {
        return match(optional, {
            Present: (value) => value,
            Empty: () => other,
        })
    }

    export function orElseGet<T>(
        optional: Optional<T>, 
        supplier: () => T,
    ): T {
        return match(optional, {
            Present: (value) => value,
            Empty: () => supplier(),
        })
    }

    export function orElseThrow<T>(
        optional: Optional<T>, 
        exceptionSupplier: () => Error,
    ): T {
        if (isPresent(optional)) {
            return optional.value
        }
        throw exceptionSupplier()
    }

    export function ifPresent<T>(
        optional: Optional<T>, 
        consumer: (value: T) => void,
    ): void {
        if (isPresent(optional)) {
            consumer(optional.value)
        }
    }

    export function filter<T>(
        optional: Optional<T>,
        predicate: (value: T) => boolean,
    ): Optional<T> {
        return match(optional, {
            Present: (value) => (predicate(value) ? of(value) : empty()),
            Empty: () => empty(),
        })
    }

    export function map<T, U>(
        optional: Optional<T>,
        mapper: (value: T) => Nullable<U>,
    ): Optional<U> {
        return match(optional, {
            Present: (value) => ofNullable(mapper(value)),
            Empty: () => empty(),
        })
    }

    export function flatMap<T, U>(
        optional: Optional<T>,
        mapper: (value: T) => Optional<U>,
    ): Optional<U> {
        return match(optional, {
            Present: (value) => mapper(value),
            Empty: () => empty(),
        })
    }
}
```

### Filtering arrays using type guards
```typescript
import { predicate, Variant } from "union-types"

type Number = 
    | Variant<"Preformatted", string> 
    | Variant<"Unformatted", number>

const isPreformatted = predicate("Preformatted")

// inferred return type is Variant<"Preformatted", string>[]
function filterPreformatted(numbers: Number[]) {
    return numbers.filter(isPreformatted)
}
```

### Usage with `switch` statement
```typescript
import { assertNever, Variant } from "union-types"

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
