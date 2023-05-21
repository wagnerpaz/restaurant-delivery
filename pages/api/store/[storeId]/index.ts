import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import Store from "/models/Store";

export default async function store(req: NextApiRequest, res: NextApiResponse) {
  const storeId = req.query.storeId as string;

  try {
    await connectToDatabase();

    if (req.method === "GET") {
      const serverStore = await Store.findById(storeId)
        .populate({
          path: "menu",
          populate: { path: "sections", populate: { path: "items" } },
        })
        .exec();
      res.status(200).json(serverStore.toObject());
    } else if (req.method === "PUT") {
      const serverStore = await Store.findOneAndUpdate(
        { _id: storeId },
        req.body,
        { new: true }
      )
        .populate({
          path: "menu.sections",
          populate: [
            { path: "products", populate: "items" },
            { path: "ingredients", populate: "items" },
          ],
        })
        .exec();
      res.status(200).json(serverStore.toObject());
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}
