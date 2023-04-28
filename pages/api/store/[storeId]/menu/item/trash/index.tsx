import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { retriveAllMenuItems } from "/lib/menuSectionUtils";

import connectToDatabase from "/lib/mongoose";
import Ingredients from "/models/Ingredients";
import MenuItem from "/models/MenuItem";
import Store from "/models/Store";
import { authOptions } from "/pages/api/auth/[...nextauth]";

async function menuItemTrash(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({
        error: "You must be signed in.",
      });
      return;
    }

    const storeId = req.query.storeId as string;

    await connectToDatabase();

    if (req.method === "GET") {
      const store = await Store.findById(storeId);
      const allStoreRegisteredMenuItems = retriveAllMenuItems(
        store.menu.sections
      );
      const trashedMenuItems = await MenuItem.find({
        _id: { $nin: allStoreRegisteredMenuItems },
        store: storeId,
      })
        .populate("composition.ingredient")
        .populate("sides.menuItem")
        .exec();
      res.status(200).json(trashedMenuItems);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export default menuItemTrash;
