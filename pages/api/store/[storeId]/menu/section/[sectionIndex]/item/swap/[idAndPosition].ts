import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { swap } from "/lib/immutable";

import connectToDatabase from "/lib/mongoose";
import serializeJson from "/lib/serializeJson";
import Store from "/models/Store";

async function swapMenuItems(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const storeId = req.query.storeId as string;
    const sectionIndex = req.query.sectionIndex as string;
    const idAndPosition = req.query.idAndPosition as string;

    const sectionIndexSplit = sectionIndex.split(",");
    const idAndPositionSplit = idAndPosition.split(",");

    const id1 = idAndPositionSplit[0];
    const atIndex = idAndPositionSplit[1];

    if (req.method === "POST" || req.method === "PUT") {
      const store = await Store.findOne();

      let section = store.menu;
      for (const index of sectionIndexSplit) {
        section = section.sections[index];
      }

      section.items = section.items.filter(
        (f: mongoose.Types.ObjectId) => f.toString() !== id1
      );
      section.items.splice(atIndex, 0, new mongoose.Types.ObjectId(id1));

      store.save();

      res.status(200).end();
    } else if (req.method === "GET") {
      const newStore = await Store.findById(storeId);
      await newStore.populate("ingredients");
      const serialized = serializeJson(newStore.ingredients);
      res.status(200).json(serialized);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export default swapMenuItems;
