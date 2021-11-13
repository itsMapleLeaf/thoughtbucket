import type { User } from "@prisma/client"
import type { RuntimeContext, RuntimeResponse } from "next-runtime"
import { redirect } from "next-runtime"
import type { ParsedUrlQuery } from "next-runtime/types/querystring"
import type { MaybePromise } from "../common/types"
import { sessionHelpers } from "./session"

export async function usingSessionUser<Result>(
  context: RuntimeContext<ParsedUrlQuery>,
  fn: (user: User) => MaybePromise<Result>,
): Promise<Result | RuntimeResponse<never>> {
  const user = await sessionHelpers(context).getUser()
  return user ? fn(user) : redirect("/login", 303)
}
