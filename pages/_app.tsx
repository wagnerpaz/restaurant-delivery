import type { AppProps } from "next/app";
import { ThemeProvider } from "@material-tailwind/react";
import { SessionProvider } from "next-auth/react";

import "/styles/globals.css";
import "react-image-crop/dist/ReactCrop.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <div
        id="app-root"
        className="font-lato bg-dark-100 fixed top-0 left-0 w-full h-full -z-10"
      />
      <div className="bg-hero-pattern bg-repeat opacity-10 fixed top-0 left-0 w-full h-full -z-10" />
      <ThemeProvider
        value={{
          select: {
            styles: {
              base: {
                label: {
                  key: "!text-light-medium",
                },
                select: {
                  key: "text-light-high bg-dark-200",
                },
                menu: {
                  key: "text-light-medium bg-dark-200 border-light-medium",
                },
                option: {
                  active: { key: "bg-dark-400 text-high-light" },
                },
              },
            },
          },
          input: {
            styles: {
              base: {
                label: {
                  key: "!text-light-medium",
                },
                input: {
                  key: "text-light-high !bg-dark-200",
                },
              },
            },
          },
          textarea: {
            styles: {
              base: {
                label: {
                  key: "!text-light-medium",
                },
                textarea: {
                  key: "text-light-high !bg-dark-200",
                },
              },
            },
          },
          button: {
            styles: {
              base: {
                initial: {
                  key: "!bg-dark-300 !shadow-none",
                },
              },
            },
          },
          tabs: {
            styles: {
              base: {
                key: "overflow-visible",
              },
            },
          },
          tabsHeader: {
            styles: {
              base: {
                key: "bg-dark-400 !text-light-high z-0",
              },
            },
          },
          tab: {
            styles: {
              base: {
                tab: {
                  initial: {
                    key: "!text-light-high",
                  },
                  disabled: {
                    key: "!bg-dark-400",
                  },
                },
                indicator: {
                  key: "!bg-dark-400",
                },
              },
            },
          },
          tabsBody: {
            styles: {
              base: {
                key: "overflow-visible",
              },
            },
          },
        }}
      >
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
