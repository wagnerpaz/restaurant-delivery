import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import {
  ChakraProvider,
  extendTheme,
  useToast,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VscError } from "react-icons/vsc";

import { getRGBColor } from "/lib/getRGBColor";

import "/styles/globals.css";
import "react-image-crop/dist/ReactCrop.css";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-32px)",
};

export const chakraTheme = extendTheme(
  {
    components: {
      Form: {
        variants: {
          floating: {
            container: {
              _focusWithin: {
                label: {
                  ...activeLabelStyles,
                },
              },
              label: {
                ...activeLabelStyles,
                top: 0,
                left: 0,
                zIndex: 1,
                position: "absolute",
                backgroundColor: "white",
                pointerEvents: "none",
                mx: 3,
                px: 1,
                my: 2,
                transformOrigin: "left top",
              },
            },
          },
        },
      },
      Input: {
        defaultProps: {
          focusBorderColor: "gray.500",
        },
      },
      Textarea: {
        defaultProps: {
          focusBorderColor: "gray.500",
        },
      },
      Select: {
        defaultProps: {
          focusBorderColor: "gray.500",
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: "blackAlpha" })
);

function App({
  Component,
  pageProps: { session, theme, ...pageProps },
}: AppProps) {
  const {
    hero = "#BE3144",
    heroA11yHigh = "#FFFFFF",
    heroA11yMedium = "#F2F2F2",
    heroA11yLow = "#E6E6E6",
    main100 = "#FFFFFF",
    main200 = "#F2F2F2",
    main300 = "#949494",
    mainA11yHigh = "#0e1111",
    mainA11yMedium = "#729191",
    mainA11yLow = "#e2e8f0",
    contrastHigh = "#FFFFFF",
    contrastMedium = "#F2F2F2",
    contrastLow = "#E6E6E6",
    contrastA11yHigh = "#0e1111",
    contrastA11yMedium = "#729191",
    contrastA11yLow = "#e2e8f0",
    money = "#036704",
    moneyDebit = "#AD3737",
    link = "#0e1111",
    add = "#11419b",
    remove = "#ce1414",
  } = theme?.colors || {};
  const { hero: heroPattern = "/istockphoto-515373062-612x612.jpg" } =
    theme?.patterns || {};

  const heroColorVar = getRGBColor(hero, "hero");
  const heroA11yHighColorVar = getRGBColor(heroA11yHigh, "hero-a11y-high");
  const heroA11yMediumColorVar = getRGBColor(
    heroA11yMedium,
    "hero-a11y-medium"
  );
  const heroA11yLowColorVar = getRGBColor(heroA11yLow, "hero-a11y-low");

  const main100ColorVar = getRGBColor(main100, "main-100");
  const main200ColorVar = getRGBColor(main200, "main-200");
  const main300ColorVar = getRGBColor(main300, "main-300");

  const contrastHighColorVar = getRGBColor(contrastHigh, "contrast-high");
  const contrastMediumColorVar = getRGBColor(contrastMedium, "contrast-medium");
  const contrastLowColorVar = getRGBColor(contrastLow, "contrast-low");

  const mainA11yHighColorVar = getRGBColor(mainA11yHigh, "main-a11y-high");
  const mainA11yMediumColorVar = getRGBColor(
    mainA11yMedium,
    "main-a11y-medium"
  );
  const mainA11yLowColorVar = getRGBColor(mainA11yLow, "main-a11y-low");

  const contrastA11yHighColorVar = getRGBColor(
    contrastA11yHigh,
    "contrast-a11y-high"
  );
  const contrastA11yMediumColorVar = getRGBColor(
    contrastA11yMedium,
    "contrast-a11y-medium"
  );
  const contrastA11yLowColorVar = getRGBColor(
    contrastA11yLow,
    "contrast-a11y-low"
  );

  const moneyColorVar = getRGBColor(money, "money");
  const moneyDebitColorVar = getRGBColor(moneyDebit, "money-debit");

  const linkColorVar = getRGBColor(link, "link");
  const addColorVar = getRGBColor(add, "add");
  const removeColorVar = getRGBColor(remove, "remove");

  const heroPatternVar = `--pattern-hero: url('${heroPattern}')`;

  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <>
      <Head>
        <style>
          :root{" "}
          {`{${heroColorVar}
             ${heroA11yHighColorVar}
             ${heroA11yMediumColorVar}
             ${heroA11yLowColorVar}
             ${main100ColorVar}
             ${main200ColorVar}
             ${main300ColorVar}
             ${contrastHighColorVar}
             ${contrastMediumColorVar}
             ${contrastLowColorVar}
             ${mainA11yHighColorVar}
             ${mainA11yMediumColorVar}
             ${mainA11yLowColorVar}
             ${contrastA11yHighColorVar}
             ${contrastA11yMediumColorVar}
             ${contrastA11yLowColorVar}
             ${moneyColorVar}
             ${moneyDebitColorVar}
             ${linkColorVar}
             ${addColorVar}
             ${removeColorVar}
             ${heroPatternVar}}
          `}
        </style>
      </Head>
      <div
        id="app-root"
        className="font-lato bg-main-100 fixed top-0 left-0 w-full h-full -z-10"
      />
      <div className="bg-hero-pattern bg-repeat opacity-10 fixed top-0 left-0 w-full h-full -z-10" />
      <MyErrorBoundary>
        <ChakraProvider theme={chakraTheme}>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </ChakraProvider>
      </MyErrorBoundary>
      {!pageLoaded && (
        <div
          style={{
            backgroundColor: "white",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 99999,
          }}
        />
      )}
    </>
  );
}

function MyErrorBoundary({ children }) {
  const toast = useToast();

  function handleOnCatch(error, errorInfo) {
    // display a toast notification for the error
    // I THINK THIS IS NOT WORKING
    toast({
      title: error.message,
      status: "error",
      duration: 9000,
      isClosable: true,
    });

    console.error(error, errorInfo);
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="w-screen h-screen flex flex-col items-center justify-center text-xl font-bold text-main-a11y-high">
          <VscError size={60} />
          Ops.. ocorreu um error crítico.
        </div>
      }
      onError={handleOnCatch}
    >
      {children}
    </ErrorBoundary>
  );
}

export default App;
