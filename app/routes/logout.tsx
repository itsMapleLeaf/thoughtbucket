import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { sessionHelpers } from "~/modules/auth/session"
import { httpCodes } from "~/modules/network/http-codes"
import { redirectTyped } from "~/modules/remix/data"

export async function action({ request }: DataFunctionArgs) {
  const { responseHeaders } = await sessionHelpers(request).delete()
  return redirectTyped("/login", {
    headers: responseHeaders,
    status: httpCodes.seeOther,
  })
}

export async function loader() {
  return redirectTyped("/login")
}
