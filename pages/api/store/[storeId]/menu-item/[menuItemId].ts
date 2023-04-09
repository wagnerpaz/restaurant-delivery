import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import serializeJson from "/lib/serializeJson";
import MenuItem from "/models/MenuItem";

async function menuItems(req: NextApiRequest, res: NextApiResponse) {
  try {
    const menuItemId = req.query.menuItemId as string;
    await connectToDatabase();
    if (req.method === "POST" || req.method === "PUT") {
      const serverItem = await MenuItem.findOneAndUpdate(
        { _id: menuItemId },
        req.body
      );

      const serverItemObject = serializeJson(serverItem.toObject());
      res.status(200).json(serverItemObject);
    } else if (req.method === "DELETE") {
      await MenuItem.findByIdAndRemove(menuItemId);
      res.status(200).end();
    } else if (req.method === "GET") {
      const found = await MenuItem.findById(menuItemId);
      if (found) {
        res.status(200).json(found.toObject());
      } else {
        res.status(404).end();
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

export default menuItems;
