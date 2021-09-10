import { Link, LoaderFunction, redirect, useRouteData } from "remix"
import { getSession } from "~/session"

export let loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request)
  if (!session) {
    return redirect("/login")
  }
  return { name: session.user.name }
}

export default function Index() {
  let data = useRouteData()

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>hi {data.name}</h1>
      <Link to="/logout">log out</Link>
    </div>
  )
}
