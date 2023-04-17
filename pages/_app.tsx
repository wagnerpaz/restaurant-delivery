import type { AppProps } from "next/app";
import { ThemeProvider } from "@material-tailwind/react";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

import materialTailwindTheme from "/config/materialTailwindTheme";

import "/styles/globals.css";
import "react-image-crop/dist/ReactCrop.css";
import { getRGBColor } from "/lib/getRGBColor";

export default function App({
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
    mainA11yHigh = "#010101",
    mainA11yMedium = "#1C1C1C",
    mainA11yLow = "#4A4A4A",
    contrastHigh = "#FFFFFF",
    contrastMedium = "#F2F2F2",
    contrastLow = "#E6E6E6",
    contrastA11yHigh = "#010101",
    contrastA11yMedium = "#1C1C1C",
    contrastA11yLow = "#4A4A4A",
    money = "#036704",
  } = theme?.colors || {};
  const { hero: heroPattern = "/istockphoto-515373062-612x612.jpg" } =
    theme?.patterns || {};
  console.log({
    hero,
    heroA11yHigh,
    heroA11yMedium,
    heroA11yLow,
    main100,
    main200,
    main300,
    contrastHigh,
    contrastMedium,
    contrastLow,
    mainA11yHigh,
    mainA11yMedium,
    mainA11yLow,
    contrastA11yHigh,
    contrastA11yMedium,
    contrastA11yLow,
    money,
    heroPattern,
  });
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

  const heroPatternVar = `--pattern-hero: url('${heroPattern}')`;

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
             ${heroPatternVar}}
          `}
        </style>
      </Head>
      <div
        id="app-root"
        className="font-lato bg-main-100 fixed top-0 left-0 w-full h-full -z-10"
      />
      <div className="bg-hero-pattern bg-repeat opacity-10 fixed top-0 left-0 w-full h-full -z-10" />
      <ThemeProvider value={materialTailwindTheme}>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
