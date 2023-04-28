import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import connectToDatabase from "/lib/mongoose";
import Ingredients from "/models/Ingredients";
import MenuItem from "/models/MenuItem";
import Store from "/models/Store";
import { authOptions } from "/pages/api/auth/[...nextauth]";

async function menuItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    //load dependant schemas
    Ingredients.name;

    const session = await getServerSession(req, res, authOptions);

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
      if (session) {
        const created = await MenuItem.create({ ...req.body, store: storeId });
        const serverItem = await MenuItem.findById(created._id)
          .populate("composition.ingredient")
          .exec();
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
      } else {
        res.status(401).json({
          error: "You must be signed in.",
        });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export default menuItem;
