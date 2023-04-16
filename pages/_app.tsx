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
    hero = "#212129",
    heroA11yHigh = "#DCDCDC",
    heroA11yMedium = "#949494",
    heroA11yLow = "#5E5E5E",
    main100 = "#4c5265",
    main200 = "#40445a",
    main300 = "#3d3e51",
    main400 = "#323949",
    main500 = "#212129",
    contrastHigh = "#DCDCDC",
    contrastMedium = "#949494",
    contrastLow = "#5E5E5E",
    mainA11yHigh = "#DCDCDC",
    mainA11yMedium = "#949494",
    mainA11yLow = "#5E5E5E",
    contrastA11yHigh = "#212129",
    contrastA11yMedium = "#323949",
    contrastA11yLow = "#3d3e51",
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
    main400,
    main500,
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
  const main400ColorVar = getRGBColor(main400, "main-400");
  const main500ColorVar = getRGBColor(main500, "main-500");

  const menuColorVar = getRGBColor(main500, "menu");

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
             ${main400ColorVar}
             ${main500ColorVar}
             ${menuColorVar}
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
