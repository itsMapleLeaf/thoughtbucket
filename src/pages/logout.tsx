import { handle, json, redirect } from "next-runtime"
import { createSessionHelpers } from "../db/session"

export const getServerSideProps = handle({
  async get(context) {
    await createSessionHelpers(context).deleteSession()
    return redirect("/")
  },
  async post(context) {
    await createSessionHelpers(context).deleteSession()
    return json({})
  },
})

export default function Logout() {
  return null
}
