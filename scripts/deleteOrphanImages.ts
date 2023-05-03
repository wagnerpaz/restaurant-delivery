import connectToDatabase from "../lib/mongoose";
import Store, { IMenuSection } from "../models/Store";
import sectionsPopulate from "../server-side-props/lib/sectionsPopulate";
import dotenv from "dotenv";
import Ingredients from "../models/Ingredients";
import MenuItem from "../models/MenuItem";
import mongoose from "mongoose";

dotenv.config();

async function run() {
  await connectToDatabase();

  Ingredients.name;
  MenuItem.name;

  const imageObjectIds = [];

  const populate = {
    path: "menu",
    populate: sectionsPopulate(
      sectionsPopulate(sectionsPopulate(sectionsPopulate(sectionsPopulate())))
    ),
  };

  const stores = await Store.find().populate(populate).exec();

  function processSection(section: IMenuSection) {
    for (const item of section.items) {
      if (item.images?.main) imageObjectIds.push(item.images.main);
    }

    if (section.sections) {
      for (const child of section.sections) {
        processSection(child);
      }
    }
  }

  for (const store of stores) {
    if (store.logo) imageObjectIds.push(store.logo);

    for (const section of store.menu.sections) {
      processSection(section);
    }
  }

  const db = mongoose.connection.db;

  //delete chunks
  await db.collection("images.chunks").deleteMany({
    files_id: { $not: { $in: imageObjectIds } },
  });

  await db.collection("images.files").deleteMany({
    _id: { $not: { $in: imageObjectIds } },
  });

  process.exit();
}

run();
