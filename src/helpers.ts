import type { Falsy } from "./types"

export function raise(value: unknown): never {
  throw value
}

export function pick<
  Subject extends Record<string, unknown>,
  Key extends keyof Subject,
>(subject: Subject, keys: Key[]): Pick<Subject, Key> {
  const result: any = {}
  for (const key of keys) {
    result[key] = subject[key]
  }
  return result
}

export function isTruthy<T>(value: T | Falsy): value is T {
  return Boolean(value)
}

export function asError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value))
}

export type Serialized<Value> = Value extends Date
  ? string
  : Value extends object
  ? { [K in keyof Value]: Serialized<Value[K]> }
  : Value

export function serialize<Value>(value: Value): Serialized<Value>
export function serialize(value: unknown): any {
  if (value instanceof Date) {
    return value.toISOString()
  }

  if (Array.isArray(value)) {
    return value.map(serialize)
  }

  if (typeof value === "object" && value !== null) {
    const result: any = {}
    for (const key in value) {
      result[key] = serialize(value[key as keyof {}]) // lol
    }
    return result
  }

  return value
}

type HasPreventDefault = {
  preventDefault: () => void
}

export const withPreventDefault =
  <EventType extends HasPreventDefault>(callback: (event: EventType) => void) =>
  (event: EventType) => {
    event.preventDefault()
    callback(event)
  }
