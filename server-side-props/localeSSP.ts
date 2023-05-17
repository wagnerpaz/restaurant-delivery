import { TPipeGetServerSideProps } from "/lib/ssrHelpers";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const localeSSP =
  (): TPipeGetServerSideProps =>
  async ({ locale }, input) => {
    return {
      props: {
        ...input.props,
        ...(await serverSideTranslations(locale as string, ["store"])),
      },
    };
  };

export default localeSSP;
