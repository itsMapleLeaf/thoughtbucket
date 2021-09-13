import * as dotenv from "dotenv"
import execa from "execa"
import { join } from "node:path"
import waitOn from "wait-on"

const configResult = dotenv.config({ path: join(__dirname, "../.env.test") })

const env = {
  ...configResult.parsed,
  NODE_ENV: "test" as const,
}

void (async function () {
  console.log("Reseting prisma database...")
  await execa("npx prisma migrate reset --force", { env, stdio: "inherit" })

  console.log("Building...")
  await execa("npm run build", { env, stdio: "inherit" })

  console.log("Starting app...")
  const app = execa("npm start", { env, stdio: "inherit" })
  await waitOn({ resources: ["tcp:localhost:3000"] })

  console.log("Running tests...")
  await execa("npm run playwright-test", {
    env,
    stdio: "inherit",
    reject: false,
  })

  app.kill()

  console.log("Done")
})()
