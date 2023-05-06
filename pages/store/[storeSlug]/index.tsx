import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { ssrHelpers } from "/lib/ssrHelpers";
import { ILocation, IStore } from "/models/types/Store";
import storeSSP from "/server-side-props/storeSSP";
import Store from "/components/Store";

interface StorePageProps {
  store: IStore;
  selectedLocation: ILocation;
}

const StorePage: NextPage<StorePageProps> = ({ store, selectedLocation }) => {
  return (
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href={store?.logo} />
        <title>{store?.name}</title>
      </Head>
      <Store store={store} selectedLocation={selectedLocation} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = ssrHelpers.pipe(
  storeSSP()
);

export default StorePage;
