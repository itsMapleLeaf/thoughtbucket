import type { RuntimeContext } from "next-runtime"
import type { ParsedUrlQuery } from "next-runtime/types/querystring"
import { raise } from "../../helpers"

export function getContextParam(
  context: RuntimeContext<ParsedUrlQuery>,
  name: string,
): string {
  const value = context.query[name] ?? raise(`Missing params ${name}`)
  return String(value)
}
