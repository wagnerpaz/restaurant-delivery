import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { ssrHelpers } from "/lib/ssrHelpers";
import { ILocation, IStore } from "/models/Store";
import storeSSP from "/server-side-props/storeSSP";
import Store from "/components/Store";
import { IIngredient } from "/models/Ingredients";

interface StorePageProps {
  store: IStore;
  ingredients: IIngredient[];
  selectedLocation: ILocation;
}

const StorePage: NextPage<StorePageProps> = ({
  store,
  selectedLocation,
  ingredients,
}) => {
  return (
    <>
      <Head>
        <link
          rel="icon"
          type="image/x-icon"
          href={`/api/download?id=${store?.logo}`}
        />
        <title>{store?.name}</title>
      </Head>
      <Store
        store={store}
        selectedLocation={selectedLocation}
        ingredients={ingredients}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = ssrHelpers.pipe(
  storeSSP()
);

export default StorePage;
