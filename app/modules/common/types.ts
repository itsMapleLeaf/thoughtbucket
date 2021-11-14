export type MaybePromise<T> = T | Promise<T>

export type Falsy = false | 0 | "" | null | undefined

export type Values<T> = T extends ArrayLike<infer Value> ? Value : T[keyof T]

type Primitive = string | number | boolean | symbol | undefined | null

export type DeepReadonly<T> = T extends Primitive
  ? T
  : {
      readonly [P in keyof T]: DeepReadonly<T[P]>
    }
