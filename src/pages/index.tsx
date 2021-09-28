import type { GetServerSideProps } from "next"
import { sessionHelpers } from "../db/session"

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (await sessionHelpers(context).get()) {
    return {
      redirect: {
        destination: "/buckets",
        permanent: false,
      },
    }
  }

  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  }
}

export default function Index() {
  return <p>Redirecting...</p>
}
