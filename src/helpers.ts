export function raise(message: string): never {
  throw new Error(message)
}

export function pick<Subject, Key extends keyof Subject>(
  subject: Subject,
  keys: Key[],
): Pick<Subject, Key> {
  const result: any = {}
  for (const key of keys) {
    result[key] = subject[key]
  }
  return result
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

  if (typeof value === "object" && value !== null) {
    const result: any = {}
    for (const key in value) {
      result[key] = serialize(value[key as keyof {}]) // lol
    }
    return result
  }

  return value
}
