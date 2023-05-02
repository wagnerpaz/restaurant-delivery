import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import connectToDatabase from "/lib/mongoose";
import Ingredients from "/models/Ingredients";
import MenuItem from "/models/MenuItem";
import Store from "/models/Store";
import { authOptions } from "/pages/api/auth/[...nextauth]";

async function menuItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    Ingredients.name;

    const storeId = req.query.storeId as string;
    const sectionIndex = req.query.sectionIndex as string;
    const menuItemId = req.query.menuItemId as string;

    const session = await getServerSession(req, res, authOptions);

    const sectionIndexSplit = sectionIndex.split(",");

    await connectToDatabase();

    if (session) {
      if (req.method === "PUT") {
        const serverMenuItem = await MenuItem.findByIdAndUpdate(
          menuItemId,
          req.body,
          { new: true }
        )
          .populate("composition.ingredient")
          .exec();
        await Store.updateOne(
          { _id: storeId },
          {
            $addToSet: {
              [`menu.sections.${sectionIndexSplit.join(".sections.")}.items`]:
                menuItemId,
            },
          }
        );
        res.status(200).json(serverMenuItem.toObject());
      } else if (req.method === "DELETE") {
        await Store.updateOne(
          { _id: storeId },
          {
            $pull: {
              [`menu.sections.${sectionIndexSplit.join(".sections.")}.items`]:
                menuItemId,
            },
          }
        );

        const store = await Store.findById(storeId);
        let section = store.menu;
        for (const index of sectionIndexSplit) {
          section = section.sections[index];
        }
        const menuItems = section.items;

        res.status(200).json(menuItems);
      } else {
        res.status(405).json({ message: "Method not allowed" });
      }
    } else {
      res.status(401).json({
        error: "You must be signed in.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export default menuItem;
