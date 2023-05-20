import { ParsedUrlQuery } from "querystring";

import connectToDatabase from "/lib/mongoose";
import serializeJson from "/lib/serializeJson";
import { TPipeGetServerSideProps } from "/lib/ssrHelpers";
import MenuItem from "/models/MenuItem";
import Store from "/models/Store";
import { IStore } from "/models/types/Store";
import MenuSection from "/models/MenuSection";

const storeSSP = (): TPipeGetServerSideProps => async (context, input) => {
  console.log("-------------");
  const allProcessBefore = performance.now();

  const databaseConnectBefore = performance.now();
  await connectToDatabase();
  const databaseConnectBeforeAfter = performance.now();
  console.log(
    `database connect took ${
      databaseConnectBeforeAfter - databaseConnectBefore
    } ms`
  );

  //ensure that dependent schemas are loaded
  MenuItem.name;
  MenuSection.name;

  const { params } = context;
  const { storeSlug, locationSlug } = params as ParsedUrlQuery;

  const store: IStore | null = await Store.findOne({
    slug: storeSlug,
  })
    .populate({ path: "menu.sections", populate: { path: "items" } })
    .exec();
  console.log(store);

  // Convert the store object to a plain JavaScript object
  const storeObject = store && serializeJson(store?.toObject());
  const jsonString = JSON.stringify(storeObject);
  const bytes = new TextEncoder().encode(jsonString).byteLength;
  console.log("storeObject", storeObject);
  console.log(`Initial store size is ${bytes / 1024} kbs`);

  const allProcessAfter = performance.now();
  console.log(`all process took ${allProcessAfter - allProcessBefore} ms`);

  // merge props and pass down to the next function
  return {
    props: {
      ...input.props,
      ...(storeObject && { store: storeObject }),
      ...(storeObject?.locations?.[0] && {
        selectedLocation: storeObject.locations[0],
      }),
      ...(storeObject?.theme && { theme: storeObject.theme }),
    },
  };
};

export default storeSSP;
