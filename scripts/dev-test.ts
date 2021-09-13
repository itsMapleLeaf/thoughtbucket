import * as dotenv from "dotenv"
import execa, { ExecaChildProcess } from "execa"
import { watch } from "node:fs"
import { join } from "node:path"

const projectRoot = join(__dirname, "..")

const configResult = dotenv.config({ path: join(projectRoot, ".env.test") })

const env = {
  ...configResult.parsed,
  NODE_ENV: "test" as const,
}

void (async function () {
  console.log("Reseting prisma database...")
  await execa("pnpx prisma migrate reset --force", { env, stdio: "inherit" })

  const dev = execa("pnpm run dev", { env, stdio: "inherit" })

  let test: ExecaChildProcess | undefined

  function runTests() {
    test?.kill()
    test = execa("npm run playwright-test", { env, stdio: "inherit" })
  }

  runTests()
  watch(join(projectRoot, "src"), { recursive: true }, runTests)
  watch(join(projectRoot, "tests"), { recursive: true }, runTests)

  process.on("SIGINT", () => {
    dev.kill()
    test?.kill()
    process.exit(0)
  })
})()
