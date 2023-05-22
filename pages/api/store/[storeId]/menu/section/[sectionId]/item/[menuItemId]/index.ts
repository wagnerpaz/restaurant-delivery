import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import connectToDatabase from "/lib/mongoose";
import MenuItem from "/models/MenuItem";
import Store from "/models/Store";
import { authOptions } from "/pages/api/auth/[...nextauth]";
import MenuSection from "/models/MenuSection";

async function menuItem(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storeId = req.query.storeId as string;
    const sectionId = req.query.sectionId as string;
    const menuItemId = req.query.menuItemId as string;

    const session = await getServerSession(req, res, authOptions);

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
        const { slug } = await Store.findById(storeId, { slug: 1 });
        await res.revalidate(`/store/${slug}`);
        res.status(200).json(serverMenuItem.toObject());
      } else if (req.method === "DELETE") {
        await MenuSection.updateOne(
          { _id: sectionId },
          { $pull: { items: menuItemId } }
        );
        const { items } = await MenuSection.findById(sectionId, { items: 1 });
        res.status(200).json(items);
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
