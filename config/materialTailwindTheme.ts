import { ThemeProvider } from "@material-tailwind/react";

export default {
  select: {
    styles: {
      base: {
        label: {
          key: "!text-main-a11y-medium",
        },
        select: {
          key: "text-main-a11y-high bg-main-200",
        },
        menu: {
          key: "text-a11y-medium bg-main-200 border-contrast-medium",
        },
        option: {
          active: { key: "bg-main-400 text-main-a11y-light" },
        },
      },
    },
  },
  input: {
    styles: {
      base: {
        label: {
          key: "!text-main-a11y-medium",
        },
        input: {
          key: "text-main-a11y-high !bg-main-200",
        },
      },
    },
  },
  textarea: {
    styles: {
      base: {
        label: {
          key: "!text-main-a11y-medium",
        },
        textarea: {
          key: "text-main-a11y-high !bg-main-200",
        },
      },
    },
  },
  button: {
    styles: {
      base: {
        initial: {
          key: "!bg-main-300 !shadow-none !text-main-a11y-high",
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
        key: "bg-main-200 !text-main-a11y-high z-0",
      },
    },
  },
  tab: {
    styles: {
      base: {
        tab: {
          initial: {
            key: "!text-main-a11y-high",
          },
          disabled: {
            key: "!bg-main-300",
          },
        },
        indicator: {
          key: "!bg-main-300",
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
} as typeof ThemeProvider.prototype.value;
