import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { createSessionHelpers } from "../../db/session"

const db = new PrismaClient()

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await createSessionHelpers(context).getSession()
  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
  })
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return {
    props: {
      name: user.name,
    },
  }
}

export default function BucketListPage(props: { name: string }) {
  return (
    <main>
      <h1>hi {props.name}</h1>
      <Link href="/api/auth/logout">log out</Link>
    </main>
  )
}
