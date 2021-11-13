import { redirect } from "remix"

export function loader() {
  return redirect("/login")
}

export default function Index() {
  return null
}
