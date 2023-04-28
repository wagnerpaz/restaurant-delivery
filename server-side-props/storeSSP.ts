import { ParsedUrlQuery } from "querystring";

import sectionsPopulate from "./lib/sectionsPopulate";
import connectToDatabase from "/lib/mongoose";
import serializeJson from "/lib/serializeJson";
import { TPipeGetServerSideProps } from "/lib/ssrHelpers";
import Ingredients, { IIngredient } from "/models/Ingredients";
import MenuItem from "/models/MenuItem";
import Store, { IStore } from "/models/Store";

const storeSSP = (): TPipeGetServerSideProps => async (context, input) => {
  await connectToDatabase();

  //ensure that dependent schemas are loaded
  MenuItem.name;
  Ingredients.name;

  const { params } = context;
  const { storeSlug, locationSlug } = params as ParsedUrlQuery;

  const populate = {
    path: "menu",
    populate: sectionsPopulate(
      sectionsPopulate(sectionsPopulate(sectionsPopulate(sectionsPopulate())))
    ),
  };

  const store: IStore | null = await Store.findOne({
    slug: storeSlug,
  })
    .populate(populate)
    .exec();

  // Convert the store object to a plain JavaScript object
  const storeObject = store && serializeJson(store?.toObject());

  const ingredients: IIngredient[] = await Ingredients.find();
  const ingredientsObjects = ingredients?.map((o) =>
    serializeJson(o.toObject())
  );

  // merge props and pass down to the next function
  return {
    props: {
      ...input.props,
      ...(storeObject && { store: storeObject }),
      ...(storeObject?.locations?.[0] && {
        selectedLocation: storeObject.locations[0],
      }),
      ingredients: ingredientsObjects,
      ...(storeObject?.theme && { theme: storeObject.theme }),
    },
  };
};

export default storeSSP;
