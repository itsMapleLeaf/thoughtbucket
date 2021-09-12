import { getSession } from "~/db/session"
import { TypedLoaderFunction, typedRedirect } from "~/remix-types"

export let loader: TypedLoaderFunction<{}> = async ({ request }) => {
  const session = await getSession(request)
  return typedRedirect(session ? "/buckets" : "/login")
}

export default function Index() {
  return null
}
