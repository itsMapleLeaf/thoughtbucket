import { BrowserContext } from "@playwright/test"
import { PrismaClient, User } from "@prisma/client"
import { sessionCookieName } from "../src/db/session"
import { createUser } from "../src/db/user"

const db = new PrismaClient()

export async function createTestUser(): Promise<User> {
  return await createUser({
    name: "testificate",
    email: "test@test.com",
    password: "testtest",
  })
}

export async function loginTestUser(context: BrowserContext) {
  const user = await createTestUser()

  const session = await db.session.upsert({
    where: { userId: user.id },
    update: { userId: user.id },
    create: { userId: user.id },
    select: { id: true },
  })

  await context.addCookies([
    {
      name: sessionCookieName,
      value: session.id,
      domain: "localhost",
      path: "/",
      httpOnly: true,
    },
  ])
}
