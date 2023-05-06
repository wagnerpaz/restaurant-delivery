import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { ssrHelpers } from "/lib/ssrHelpers";
import { ILocation, IStore } from "/models/types/Store";
import storeSSP from "/server-side-props/storeSSP";
import Store from "/components/Store";
import { ScreenSizeProvider } from "/contexts/BrowserScreenSizeContext";

interface StorePageProps {
  store: IStore;
  selectedLocation: ILocation;
  browserScreenSize: { width: number; height: number };
}

const StorePage: NextPage<StorePageProps> = ({ store, selectedLocation }) => {
  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href={store?.logo} />
        <title>{store?.name}</title>
      </Head>
      <ScreenSizeProvider>
        <Store store={store} selectedLocation={selectedLocation} />
      </ScreenSizeProvider>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = ssrHelpers.pipe(
  storeSSP()
);

export default StorePage;
