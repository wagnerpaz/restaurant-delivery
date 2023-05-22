import { TPipeGetServerSideProps } from "/lib/ssrHelpers";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const localeSSP =
  (): TPipeGetServerSideProps =>
  async ({ locale }, input) => {
    console.log("will revalidate locale", locale);
    return {
      props: {
        ...input.props,
        ...(await serverSideTranslations(locale as string, ["store"])),
      },
    };
  };

export default localeSSP;
