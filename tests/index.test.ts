import { expect, test } from "@playwright/test"
import { PrismaClient } from "@prisma/client"
import { loginTestUser } from "./helpers"

test.beforeEach(async ({ context }) => {
  const db = new PrismaClient()
  await db.session.deleteMany()
  await db.user.deleteMany()
  await context.clearCookies()
  await db.$disconnect()
})

test("redirects to login when logged out", async ({ page }) => {
  await page.goto("http://localhost:3000/")
  expect(page.url()).toBe("http://localhost:3000/login")
})

test("redirects to buckets when logged in", async ({ page, context }) => {
  await loginTestUser(context)

  // await page.goto("http://localhost:3000/login")
  // await page.type('input[name="email"]', "test@test.com")
  // await page.type('input[name="password"]', "testtest")
  // await page.click("button[type=submit]")

  // console.log(await context.storageState())

  await page.goto("http://localhost:3000/")
  expect(page.url()).toBe("http://localhost:3000/buckets")
})
