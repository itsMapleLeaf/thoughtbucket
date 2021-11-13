export type Serialized<Value> = Value extends Date
  ? string
  : Value extends object
  ? {
      [K in keyof Value]: Serialized<Value[K]>
    }
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
