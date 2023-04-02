import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import MenuItem from "/models/MenuItem";
import Store from "/models/Store";

async function menuItems(req: NextApiRequest, res: NextApiResponse) {
  try {
    const menuItemId = req.query.menuItemId as string;

    const conn = await connectToDatabase();

    const serverMenuItem = await MenuItem.findOneAndUpdate(
      { _id: menuItemId },
      req.body
    );

    res.status(200).end();
  } catch (err) {
    // console.error(err);
    res.status(500).send("Server Error");
  }
}

export default menuItems;
