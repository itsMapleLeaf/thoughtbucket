// nextjs custom document
import Document, { Head, Html, Main, NextScript } from "next/document"
import React from "react"

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
