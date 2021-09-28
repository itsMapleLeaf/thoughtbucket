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

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
