import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VscError } from "react-icons/vsc";
import NProgress from "nprogress";
import Router from "next/router";
import { appWithTranslation } from "next-i18next";

import { getRGBColor } from "/lib/getRGBColor";

import "react-tabs/style/react-tabs.css";
import "nprogress/nprogress.css";
import "placeholder-loading/dist/css/placeholder-loading.min.css";
import "/styles/globals.css";
import { ToastProvider } from "/contexts/ToastContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-32px)",
};

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});

Router.events.on("routeChangeError", () => {
  NProgress.done();
});

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
    mainA11yMedium = "#4A5959",
    mainA11yLow = "#c9d1db",
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
    warning = "#DD6B20",
    error = "#E53E3E",
    info = "#3182CE",
    success = "#38A169",
  } = theme?.colors || {};
  const { hero: heroPattern = "/istockphoto-515373062-612x612.webp" } =
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

  const warningColorVar = getRGBColor(warning, "warning");
  const errorColorVar = getRGBColor(error, "error");
  const infoColorVar = getRGBColor(info, "info");
  const successColorVar = getRGBColor(success, "success");

  const heroPatternVar = `--pattern-hero: url(${heroPattern})`;

  useEffect(() => {});

  const [pageLoaded, setPageLoaded] = useState(false);
  const [appRoot, setAppRoot] = useState<HTMLDivElement>(null);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <>
      <Head>
        <style>
          {`:root{${heroColorVar}
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
             ${warningColorVar}
             ${errorColorVar}
             ${infoColorVar}
             ${successColorVar}
             ${heroPatternVar}}
          `}
        </style>
      </Head>
      <div
        id="app-root"
        className="font-lato bg-main-100 fixed top-0 left-0 w-full h-full -z-10"
      />
      <div className="bg-hero-pattern bg-repeat opacity-10 fixed top-0 left-0 w-full h-full -z-10" />
      <div ref={setAppRoot}></div>
      <MyErrorBoundary>
        <SessionProvider session={session}>
          <ToastProvider portalTarget={appRoot}>
            <DndProvider backend={HTML5Backend}>
              <Component {...pageProps} />
            </DndProvider>
          </ToastProvider>
        </SessionProvider>
      </MyErrorBoundary>
    </>
  );
}

function MyErrorBoundary({ children }) {
  function handleOnCatch(error, errorInfo) {
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

export default appWithTranslation(App);
