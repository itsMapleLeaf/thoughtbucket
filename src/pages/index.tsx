import { GetServerSideProps } from "next"
import { createSessionHelpers } from "../db/session"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = createSessionHelpers(context)

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
