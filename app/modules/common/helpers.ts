import type { Falsy } from "./types"

export function raise(value: unknown): never {
  throw value
}

type PickFn = <
  Subject extends Record<string, unknown>,
  Key extends keyof Subject,
>(
  subject: Subject,
  keys: Key[],
) => Pick<Subject, Key>

export const pick: PickFn = (subject, keys) =>
  Object.fromEntries(keys.map((key) => [key, subject[key]])) as any

export const isTruthy = <T>(value: T | Falsy): value is T => Boolean(value)

export const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(String(value))

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export const joinContentfulStrings = (
  strings: Array<string | Falsy>,
  separator: string,
) => strings.filter(isTruthy).join(separator)
