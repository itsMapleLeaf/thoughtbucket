import { GetServerSideProps } from "next"
import { createSessionManager } from "../db/session"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = createSessionManager(context)

  if (await session.getSession()) {
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
