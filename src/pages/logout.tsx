import type { GetServerSideProps } from "next"
import { createSessionHelpers } from "../db/session"

export const getServerSideProps: GetServerSideProps = async (context) => {
  await createSessionHelpers(context).deleteSession()
  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  }
}

export default function Logout() {
  return null
}
