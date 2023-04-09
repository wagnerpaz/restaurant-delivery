import { NextApiRequest, NextApiResponse } from "next";
import axiosInstance from "/lib/axiosInstance";

import connectToDatabase from "/lib/mongoose";
import MenuItem from "/models/MenuItem";
import Store from "/models/Store";

async function menuItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storeId = req.query.storeId as string;
    const sectionIndex = req.query.sectionIndex as string;
    const menuItemId = req.query.menuItemId as string;

    const sectionIndexSplit = sectionIndex.split(",");

    await connectToDatabase();

    if (req.method === "PUT") {
      const serverMenuItem = await MenuItem.findByIdAndUpdate(
        menuItemId,
        req.body,
        { new: true }
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
      await MenuItem.deleteOne({ _id: menuItemId });

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
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

export default menuItem;
