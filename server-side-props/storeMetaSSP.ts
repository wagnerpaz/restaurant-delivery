import { ParsedUrlQuery } from "querystring";

import connectToDatabase from "/lib/mongoose";
import serializeJson from "/lib/serializeJson";
import { TPipeGetServerSideProps } from "/lib/ssrHelpers";
import Ingredients, { IIngredient } from "/models/Ingredients";
import Store, { IStore } from "/models/Store";

const storesMetaSSP = (): TPipeGetServerSideProps => async (context, input) => {
  await connectToDatabase();

  const stores: IStore[] | null = await Store.find({}).exec();

  // Convert the store object to a plain JavaScript object
  const storesObject = stores?.map((s) => serializeJson(s.toObject()));

  // merge props and pass down to the next function
  return {
    props: {
      ...input.props,
      stores: storesObject,
    },
  };
};

export default storesMetaSSP;
