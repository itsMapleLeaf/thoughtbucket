export type MaybePromise<T> = T | Promise<T>

export type Falsy = false | 0 | "" | null | undefined

export type Values<T> = T extends ArrayLike<unknown> ? T[number] : T[keyof T]
