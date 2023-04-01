import { ParsedUrlQuery } from "querystring";
import connectToDatabase from "/lib/mongoose";
import serializeJson from "/lib/serializeJson";

import { TPipeGetServerSideProps } from "/lib/ssrHelpers";
import Ingredients from "/models/Ingredients";
import MenuItem from "/models/MenuItem";
import Store, { IStore } from "/models/Store";

const storeSSP = (): TPipeGetServerSideProps => async (context, input) => {
  await connectToDatabase();

  //ensure that dependent schemas are loaded
  MenuItem.name;
  Ingredients.name;

  const { params } = context;
  const { storeSlug, locationSlug } = params as ParsedUrlQuery;

  const store: IStore | null = await Store.findOne({
    slug: storeSlug,
  });
  if (store) {
    await store.populate("menu");
    await store.populate("menu.sections.items");
    await store.populate("menu.sections.items.composition");
    await store.populate("menu.sections.items.composition.ingredient");
    await store.populate("menu.sections.items.sides.menuItem");
  }

  // Convert the store object to a plain JavaScript object
  const storeObject = serializeJson(store?.toObject());

  // merge props and pass down to the next function
  return {
    props: {
      ...input.props,
      store: storeObject,
      selectedLocation: storeObject.locations[0],
    },
  };
};

export default storeSSP;
