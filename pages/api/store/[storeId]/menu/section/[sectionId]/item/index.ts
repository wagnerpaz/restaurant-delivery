import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import connectToDatabase from "/lib/mongoose";
import MenuItem from "/models/MenuItem";
import Store from "/models/Store";
import { authOptions } from "/pages/api/auth/[...nextauth]";
import MenuSection from "/models/MenuSection";

async function menuItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    const storeId = req.query.storeId as string;
    const sectionId = req.query.sectionId as string;

    await connectToDatabase();

    if (req.method === "GET") {
      const found = await MenuSection.find({ _id: sectionId });
      res.status(200).json(found.toObject());
    } else if (req.method === "POST") {
      if (session) {
        const created = await MenuItem.create({ ...req.body, store: storeId });
        const serverItem = await MenuItem.findById(created._id)
          .populate("composition.ingredient")
          .exec();
        await MenuSection.updateOne(
          { _id: sectionId },
          {
            $push: {
              items: serverItem,
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
