import { LoaderFunction, redirect } from "remix"
import { deleteSession } from "~/db/session"

export const loader: LoaderFunction = async (args) => {
  return redirect("/login", {
    headers: {
      "Set-Cookie": await deleteSession(args.request.clone()),
    },
  })
}

export default function LogoutPage() {
  return <p>logout</p>
}
