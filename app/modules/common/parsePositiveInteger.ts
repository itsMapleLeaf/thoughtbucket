export function parsePositiveInteger(input: string): number {
  const output = Number(input)
  if (Number.isInteger(output) && output >= 0) return output
  throw new Error("input must be a positive integer")
}
