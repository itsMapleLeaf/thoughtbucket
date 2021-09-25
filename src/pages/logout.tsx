import type { GetServerSideProps } from "next"
import { createSessionHelpers } from "../db/session"

export const getServerSideProps: GetServerSideProps = async (context) => {
  await createSessionHelpers(context).deleteSession()
  return {
    redirect: {
      destination: "/login",
      statusCode: 303,
    },
  }
}

export default function Logout() {
  return null
}
