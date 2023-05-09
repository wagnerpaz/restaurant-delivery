import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/placeholder-loading@0.6.0/dist/css/placeholder-loading.min.css"
        />
      </Head>
      <body className="custom-scrollbar">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
