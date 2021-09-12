import { BrowserContext } from "@playwright/test"
import { User } from "@prisma/client"
import { parse } from "cookie"
import { createSessionCookie } from "../app/session"
import { createUser } from "../app/user"

export async function createTestUser(): Promise<User> {
  return await createUser({
    name: "testificate",
    email: "test@test.com",
    password: "testtest",
  })
}

export async function loginTestUser(context: BrowserContext) {
  const cookieHeader = await createSessionCookie(await createTestUser())

  const { session } = parse(cookieHeader)

  await context.addCookies([
    {
      name: "session",
      value: session,
      domain: "localhost",
      path: "/",
      httpOnly: true,
    },
  ])
}
