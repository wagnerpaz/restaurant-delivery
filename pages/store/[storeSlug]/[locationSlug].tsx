import { GetServerSideProps, NextPage } from "next";

import { ssrHelpers } from "/lib/ssrHelpers";
import Store, { ILocation, IStore } from "/models/Store";
import storeSSP from "/server-side-props/storeSSP";

interface StorePageProps {
  store: IStore;
  selectedLocation: ILocation;
}

const StoreLocationPage: NextPage<StorePageProps> = ({
  store,
  selectedLocation,
}) => {
  return <Store store={store} selectedLocation={selectedLocation} />;
};

export const getServerSideProps: GetServerSideProps = ssrHelpers.pipe(
  storeSSP()
);

export default StoreLocationPage;
