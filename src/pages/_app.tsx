import type { AppProps } from "next/app"
import { AppHead } from "../modules/app/AppHead"
import "../tailwind.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppHead />
      <Component {...pageProps} />
    </>
  )
}
