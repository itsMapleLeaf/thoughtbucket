import { Outlet } from "react-router-dom"
import type { LinksFunction, MetaFunction } from "remix"
import { Links, LiveReload, Meta, Scripts } from "remix"
import tailwindCss from "./styles/tailwind.css"

export const meta: MetaFunction = () => ({
  title: "thoughtbucket",
  description: "put your thoughts in a bucket",
})

export let links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindCss },
]

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
    </Document>
  )
}
