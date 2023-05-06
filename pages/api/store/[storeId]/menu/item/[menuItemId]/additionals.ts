import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import MenuItem from "/models/MenuItem";

async function menuItemAdditionals(req: NextApiRequest, res: NextApiResponse) {
  const menuItemId = req.query.menuItemId;

  try {
    await connectToDatabase();

    if (req.method === "GET") {
      const found = await MenuItem.findById(menuItemId, {
        additionals: 1,
      }).populate("additionals.items.ingredient");
      res.status(200).json(found.additionals.toObject());
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export default menuItemAdditionals;
