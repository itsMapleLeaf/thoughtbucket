import dotenv from "dotenv"
import execa from "execa"
import { join } from "node:path"
import waitOn from "wait-on"

const env = dotenv.config({ path: join(__dirname, "../.env.test") }).parsed
console.log("env", env)

void (async function () {
  console.log("Reseting prisma database...")
  await execa("npx prisma migrate reset --force", { env })

  console.log("Building...")
  await execa("npm run build", { env })

  console.log("Starting app")
  const app = execa("npm start", { env })

  console.log("Waiting on localhost:3000...")
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
