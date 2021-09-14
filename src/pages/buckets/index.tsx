import { GetServerSideProps } from "next"
import { createSessionHelpers } from "../../db/session"
import { AppLayout } from "../../modules/app/AppLayout"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await createSessionHelpers(context).getUser()
  if (!user) {
    return {
      redirect: { destination: "/login", permanent: false },
    }
  }

  return {
    props: {
      user: {
        name: user.name,
      },
    },
  }
}

export default function BucketListPage(props: { user: { name: string } }) {
  return (
    <AppLayout user={props.user}>
      <p>h</p>
    </AppLayout>
  )
}
