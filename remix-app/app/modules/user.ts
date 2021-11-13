import type { User } from "@prisma/client"
import bcrypt from "bcryptjs"
import { getClient } from "./db"

const db = getClient()

export async function createUser({
  name,
  email,
  password,
}: {
  email: string
  password: string
  name: string
}): Promise<User> {
  return await db.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
    },
  })
}

export async function loginUser({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<User | undefined> {
  const user = await db.user.findUnique({
    where: { email },
  })
  if (!user) return

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return

  return user
}
