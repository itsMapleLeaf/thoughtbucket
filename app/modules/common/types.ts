export type MaybePromise<T> = T | Promise<T>

export type Falsy = false | 0 | "" | null | undefined

export type Values<T> = T extends ArrayLike<infer Value> ? Value : T[keyof T]

export type Awaited<T> = T extends Promise<infer V> ? Promise<V> : T
