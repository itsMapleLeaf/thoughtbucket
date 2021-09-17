import { GetServerSideProps } from "next"
import { redirect } from "next-runtime"
import { createSessionHelpers } from "../db/session"

export const getServerSideProps: GetServerSideProps = async (context) => {
  await createSessionHelpers(context).deleteSession()
  return redirect("/")
}

export default function Logout() {
  return null
}
