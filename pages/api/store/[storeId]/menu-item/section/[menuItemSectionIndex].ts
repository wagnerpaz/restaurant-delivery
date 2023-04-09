import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import MenuItem from "/models/MenuItem";
import Store from "/models/Store";

async function createMenuItemSection(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const storeId = req.query.storeId as string;
    const menuItemSectionIndex = req.query.menuItemSectionIndex as string;

    await connectToDatabase();

    if (req.method === "PUT") {
      const serverMenuItem = await MenuItem.create(req.body);
      await Store.updateOne(
        { _id: storeId },
        {
          $push: {
            [`menu.sections.${menuItemSectionIndex}.items`]: serverMenuItem,
          },
        }
      );
      res.status(200).json(serverMenuItem.toObject());
    } else if (req.method === "GET") {
      const store = await Store.findById(storeId);
      const menuItems = store.menu.sections[menuItemSectionIndex];
      res.status(200).json(menuItems);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

export default createMenuItemSection;
