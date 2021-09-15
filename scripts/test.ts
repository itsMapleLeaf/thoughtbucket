import cypress from "cypress"
import execa from "execa"
import next from "next"
import { createServer } from "node:http"
import { join } from "node:path"

if (process.env.NODE_ENV !== "test") {
  console.error("Script should only be run in test mode, exiting")
  process.exit(1)
}

void (async function () {
  console.log("Building app...")
  await execa("pnpm run build", { stdio: "inherit" })

  console.log("Starting app...")
  const app = next({ dir: join(__dirname, ".."), quiet: true })
  await app.prepare()

  const server = createServer(app.getRequestHandler())
  await new Promise<void>((resolve) => server.listen(3000, resolve))

  console.log("Running tests...")
  await cypress.run()

  await app.close()
  await new Promise((resolve) => server.close(resolve))

  console.log("Done")
})()
