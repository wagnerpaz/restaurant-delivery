import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import MenuItem from "/models/MenuItem";
import Store from "/models/Store";

async function menuItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storeId = req.query.storeId as string;
    const sectionIndex = req.query.sectionIndex as string;

    const sectionIndexSplit = sectionIndex.split(",");

    await connectToDatabase();

    if (req.method === "GET") {
      const store = await Store.findById(storeId);
      let section = store.menu;
      for (const index of sectionIndexSplit) {
        section = section.sections[index];
      }
      const menuItems = section.items;
      res.status(200).json(menuItems);
    } else if (req.method === "POST") {
      const serverItem = await MenuItem.create(req.body);
      await Store.updateOne(
        { _id: storeId },
        {
          $push: {
            [`menu.sections.${sectionIndexSplit.join(".sections.")}.items`]:
              serverItem,
          },
        }
      );
      res.status(200).json(serverItem.toObject());
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

export default menuItem;
