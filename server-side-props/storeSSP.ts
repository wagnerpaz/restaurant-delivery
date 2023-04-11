import { ParsedUrlQuery } from "querystring";

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

  const sectionsPopulate = (append?: any) => {
    const populate = [
      {
        path: "items",
        populate: [
          { path: "composition", populate: { path: "ingredient" } },
          { path: "sides", populate: { path: "menuItem" } },
        ],
      },
    ];
    if (append) {
      populate.push(append);
    }
    return {
      path: "sections",
      populate,
    };
  };

  const populate = {
    path: "menu",
    populate: sectionsPopulate(
      sectionsPopulate(sectionsPopulate(sectionsPopulate(sectionsPopulate())))
    ),
  };

  const store: IStore | null = await Store.findOne({
    slug: storeSlug,
  })
    .populate("ingredients")
    .populate(populate)
    .exec();

  // Convert the store object to a plain JavaScript object
  const storeObject = serializeJson(store?.toObject());

  const ingredients: IIngredient[] = await Ingredients.find();
  const ingredientsObjects = ingredients?.map((o) =>
    serializeJson(o.toObject())
  );

  // merge props and pass down to the next function
  return {
    props: {
      ...input.props,
      store: storeObject,
      selectedLocation: storeObject.locations[0],
      ingredients: ingredientsObjects,
    },
  };
};

export default storeSSP;
