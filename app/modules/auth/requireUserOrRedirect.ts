import { redirect } from "remix"
import { sessionHelpers } from "~/modules/auth/session"
import { raise } from "~/modules/common/helpers"

export async function requireUserOrRedirect(request: Request) {
  const user = await sessionHelpers(request).getUser()
  return user ?? raise(redirect("/login"))
}
