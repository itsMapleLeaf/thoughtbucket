import test from "@playwright/test"
import { PrismaClient } from "@prisma/client"

test.beforeEach(async ({ context }) => {
  const db = new PrismaClient()
  await db.session.deleteMany()
  await db.user.deleteMany()
  await db.$disconnect()
  await context.clearCookies()
})

test("redirects to buckets after signup", async ({ page }) => {
  await page.goto("http://localhost:3000/signup")

  await page.type("input[name=name]", "testificate")
  await page.type("input[name=email]", "test@test.com")
  await page.type("input[name=password]", "testtest")

  await page.click("button[type=submit]")

  await page.waitForURL("http://localhost:3000/buckets", {
    timeout: 10000,
    waitUntil: "networkidle",
  })
})
