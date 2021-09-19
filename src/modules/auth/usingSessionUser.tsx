import type { User } from "@prisma/client"
import type { RuntimeContext, RuntimeResponse } from "next-runtime"
import { redirect } from "next-runtime"
import type { ParsedUrlQuery } from "next-runtime/types/querystring"
import { createSessionHelpers } from "../../db/session"
import type { MaybePromise } from "../../types"

export async function usingSessionUser<Result>(
  context: RuntimeContext<ParsedUrlQuery>,
  fn: (user: User) => MaybePromise<Result>,
): Promise<Result | RuntimeResponse<never>> {
  const user = await createSessionHelpers(context).getUser()
  return user ? fn(user) : redirect("/login", 303)
}
