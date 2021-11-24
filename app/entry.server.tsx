import { config } from "dotenv"
import ReactDOMServer from "react-dom/server"
import type { EntryContext } from "remix"
import { RemixServer } from "remix"

config({ path: ".env" })

if (process.env.TEST) {
  console.info("Loaded test env")
  config({ path: ".env.test" })
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const markup = ReactDOMServer.renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  )

  responseHeaders.set("Content-Type", "text/html")

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
