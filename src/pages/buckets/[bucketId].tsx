import { GetServerSideProps } from "next"
import { getClient } from "../../db/client"
import { createSessionHelpers } from "../../db/session"
import { AppLayout } from "../../modules/app/AppLayout"

const db = getClient()

type Props = {
  user: { name: string }
  bucket: { name: string }
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const user = await createSessionHelpers(context).getUser()
  if (!user) {
    return {
      redirect: { destination: "/login", permanent: false },
    }
  }

  const id = context.params?.bucketId
  if (!id) {
    return { notFound: true }
  }

  const bucket = await db.bucket.findUnique({
    where: {
      id: String(id),
    },
  })
  if (!bucket) {
    return { notFound: true }
  }

  return {
    props: {
      user: { name: user.name },
      bucket: { name: bucket.name },
    },
  }
}

export default function BucketPage(props: Props) {
  return (
    <AppLayout user={props.user}>
      <h1 className="text-2xl font-light">{props.bucket.name}</h1>
    </AppLayout>
  )
}
