import { config } from "dotenv"
import execa, { ExecaChildProcess } from "execa"
import { watch } from "node:fs"
import { join } from "node:path"

const projectRoot = join(__dirname, "..")

const env = config({ path: join(projectRoot, ".env.test") }).parsed
console.log("env", env)

void (async function () {
  console.log("Reseting prisma database...")
  await execa("npx prisma migrate reset --force", { env })

  execa("npm run remix-run", { stdio: "inherit", env })
  execa("npm run postcss-watch", { stdio: "inherit", env })

  let test: ExecaChildProcess | undefined

  function runTests() {
    test?.kill()
    test = execa("npm run playwright-test", { stdio: "inherit", env })
  }

  runTests()
  watch(join(projectRoot, "app"), { recursive: true }, runTests)
  watch(join(projectRoot, "tests"), { recursive: true }, runTests)
})()
