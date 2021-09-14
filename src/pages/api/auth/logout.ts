import { NextApiHandler } from "next"
import { createSessionHelpers } from "../../../db/session"

const handler: NextApiHandler = async (req, res) => {
  await createSessionHelpers({ req, res }).deleteSession()
  res.redirect("/login")
}
export default handler
