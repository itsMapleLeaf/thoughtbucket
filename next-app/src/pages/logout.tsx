import type { GetServerSideProps } from "next"
import { sessionHelpers } from "../modules/auth/session"

export const getServerSideProps: GetServerSideProps = async (context) => {
  await sessionHelpers(context).delete()
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
