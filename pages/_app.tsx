import type { AppProps } from "next/app";

import "/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div
        id="app-root"
        className="font-lato bg-dark-100 fixed top-0 left-0 w-full h-full -z-10"
      />
      <div className="bg-hero-pattern bg-repeat opacity-10 fixed top-0 left-0 w-full h-full -z-10" />
      <div>
        <Component {...pageProps} />
      </div>
    </>
  );
}
