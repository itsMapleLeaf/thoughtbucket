import type { DataFunctionArgs } from "@remix-run/server-runtime"
import { sessionHelpers } from "~/modules/auth/session"
import { redirectTyped } from "~/modules/remix/data"

export async function loader({ request }: DataFunctionArgs) {
  const { responseHeaders } = await sessionHelpers(request).delete()
  return redirectTyped("/login", { headers: responseHeaders })
}

export default function Logout() {
  return <p>Logging out...</p>
}
