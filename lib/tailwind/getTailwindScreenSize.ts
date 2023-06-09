export type ScreenWidthRange = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

// const fullConfig = resolveConfig(tailwindConfig);
const fullConfig = {
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
};

export default function getTailwindScreenSize(
  width: number
): [ScreenWidthRange, number] {
  const windowWidth = width;
  const smValue = +(fullConfig.theme?.screens.sm).split("px")[0];
  const mdValue = +fullConfig.theme?.screens.md.split("px")[0];
  const lgValue = +fullConfig.theme?.screens.lg.split("px")[0];
  const xlValue = +fullConfig.theme?.screens.xl.split("px")[0];
  const _2xlValue = +fullConfig.theme?.screens["2xl"].split("px")[0];

  if (windowWidth < smValue) {
    return ["xs", width];
  } else if (windowWidth < mdValue) {
    return ["sm", smValue];
  } else if (windowWidth < lgValue) {
    return ["md", mdValue];
  } else if (windowWidth < xlValue) {
    return ["lg", lgValue];
  } else if (windowWidth < _2xlValue) {
    return ["xl", xlValue];
  } else {
    return ["2xl", _2xlValue];
  }
}
