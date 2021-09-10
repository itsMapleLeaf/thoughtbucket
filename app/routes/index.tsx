import { TypedLoaderFunction, typedRedirect } from "~/remix-types"
import { getSession } from "~/session"

export let loader: TypedLoaderFunction<{}> = async ({ request }) => {
  const session = await getSession(request)
  return typedRedirect(session ? "/buckets" : "/login")
}

export default function Index() {
  return null
}
