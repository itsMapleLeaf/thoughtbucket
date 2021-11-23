import { Outlet } from "react-router-dom"
import type { LinksFunction } from "remix"
import { Links, LiveReload, Meta, Scripts, useCatch } from "remix"
import { SystemMessageLayout } from "~/modules/app/SystemMessageLayout"
import { toError } from "~/modules/common/helpers"
import { NavigationIndicator } from "~/modules/routing/NavigationIndicator"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: "/tailwindcss" }]
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html
      lang="en"
      className="break-words text-slate-100 bg-slate-900 selection:bg-white/30"
    >
      <head>
        <meta charSet="utf-8" />

        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&display=swap"
          rel="stylesheet"
        />

        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <NavigationIndicator />
        <Scripts />
        {process.env.NODE_ENV !== "production" && <LiveReload />}
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

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 404) {
    return (
      <Document title={`${caught.status} ${caught.statusText}`}>
        <SystemMessageLayout title="oops">
          {"couldn't find what you were looking for :("}
        </SystemMessageLayout>
      </Document>
    )
  }

  throw new Error(`Unexpected caught response with status ${caught.status}`)
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const errorInfo = toError(error)

  console.error(error)

  return (
    <Document title="oops">
      <SystemMessageLayout title="oops">
        <pre className="p-3 overflow-x-auto rounded-md shadow-inner bg-black/50">
          {errorInfo.stack || errorInfo.message}
        </pre>
      </SystemMessageLayout>
    </Document>
  )
}
