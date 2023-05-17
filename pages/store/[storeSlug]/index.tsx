import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { ssrHelpers } from "/lib/ssrHelpers";
import { ILocation, IStore } from "/models/types/Store";
import storeSSP from "/server-side-props/storeSSP";
import Store from "/components/Store";
import { ScreenSizeProvider } from "/contexts/BrowserScreenSizeContext";
import StoreModel from "/models/Store";
import connectToDatabase from "/lib/mongoose";
import localeSSP from "/server-side-props/localeSSP";

interface StorePageProps {
  store: IStore;
  selectedLocation: ILocation;
  browserScreenSize: { width: number; height: number };
}

const StorePage: NextPage<StorePageProps> = ({ store, selectedLocation }) => {
  return (
    <>
      <Head>
        <link
          rel="icon"
          type="image/x-icon"
          href={`${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN_NAME}/${store?.logo}`}
        />
        <title>{store?.name}</title>
      </Head>
      <ScreenSizeProvider>
        <Store store={store} selectedLocation={selectedLocation} />
      </ScreenSizeProvider>
    </>
  );
};

export const getStaticProps: GetServerSideProps = ssrHelpers.pipe(
  localeSSP(),
  storeSSP()
);
export async function getStaticPaths() {
  await connectToDatabase();
  const slugs = await StoreModel.find({}, { slug: 1 });
  console.log("slugs", slugs);
  return {
    paths: slugs.map(({ slug }) => ({ params: { storeSlug: slug } })),
    fallback: false, // can also be true or 'blocking'
  };
}

export default StorePage;
