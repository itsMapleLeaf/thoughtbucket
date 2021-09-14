// nextjs custom document
import Document, { Head, Html, Main, NextScript } from "next/document"
import React from "react"

export default class MyDocument extends Document {
  render() {
    return (
      <Html
        lang="en"
        className="text-gray-100 break-words bg-gray-900 selection:bg-white/30"
        style={{ wordBreak: "break-word" }}
      >
        <Head>
          <meta charSet="utf-8" />
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
