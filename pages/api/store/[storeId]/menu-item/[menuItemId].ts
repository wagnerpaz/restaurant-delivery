import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import serializeJson from "/lib/serializeJson";
import MenuItem from "/models/MenuItem";

async function menuItems(req: NextApiRequest, res: NextApiResponse) {
  try {
    const menuItemId = req.query.menuItemId as string;
    if (req.method === "POST" || req.method === "PUT") {
      await connectToDatabase();

      const serverItem = await MenuItem.findOneAndUpdate(
        { _id: menuItemId },
        req.body
      );

      res.status(200).end(serverItem.toObject());
    }
    if (req.method === "DELETE") {
      await MenuItem.findByIdAndRemove(menuItemId);
      res.status(200).end();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

export default menuItems;
