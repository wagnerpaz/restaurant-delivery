import { GetServerSideProps, NextPage } from "next";

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
    <Store
      store={store}
      selectedLocation={selectedLocation}
      ingredients={ingredients}
    />
  );
};

export const getServerSideProps: GetServerSideProps = ssrHelpers.pipe(
  storeSSP()
);

export default StorePage;
