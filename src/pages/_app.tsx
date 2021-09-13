import { AppProps } from "next/app"
import "../tailwind.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
