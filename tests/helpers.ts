import { BrowserContext } from "@playwright/test"
import { PrismaClient } from "@prisma/client"
import { randomUUID } from "crypto"
import { sessionCookieName } from "../src/db/session"
import { createUser } from "../src/db/user"

export async function createTestUser() {
  const password = "testtest"
  const user = await createUser({
    name: `testificate-${randomUUID()}`,
    email: `${randomUUID()}@test.com`,
    password: password,
  })
  return { ...user, password }
}

export async function loginTestUser(context: BrowserContext) {
  const user = await createTestUser()

  const db = new PrismaClient()
  const session = await db.session.upsert({
    where: { userId: user.id },
    update: { userId: user.id },
    create: { userId: user.id },
    select: { id: true },
  })
  await db.$disconnect()

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
