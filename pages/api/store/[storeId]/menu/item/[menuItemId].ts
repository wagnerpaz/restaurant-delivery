import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import connectToDatabase from "/lib/mongoose";
import MenuItem from "/models/MenuItem";
import { authOptions } from "/pages/api/auth/[...nextauth]";

async function menuItem(req: NextApiRequest, res: NextApiResponse) {
  const menuItemId = req.query.menuItemId;

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({
        error: "You must be signed in.",
      });
      return;
    }

    await connectToDatabase();

    if (req.method === "DELETE") {
      await MenuItem.deleteOne({
        _id: menuItemId,
      }).exec();
      res.status(200).end();
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export default menuItem;
