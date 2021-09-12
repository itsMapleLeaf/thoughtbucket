import { Link, useRouteData } from "remix"
import { db } from "~/db"
import { TypedLoaderFunction, typedRedirect } from "~/remix-types"
import { getSession } from "~/session"

type Data = {
  name: string
}

export let loader: TypedLoaderFunction<Data> = async ({ request }) => {
  const session = await getSession(request)
  if (!session) {
    return typedRedirect("/login")
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { name: true },
  })
  if (!user) {
    return typedRedirect("/login")
  }

  return { name: user.name }
}

export default function BucketListPage() {
  let data = useRouteData<Data>()

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>hi {data.name}</h1>
      <Link to="/logout">log out</Link>
    </div>
  )
}
