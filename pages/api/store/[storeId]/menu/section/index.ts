import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import Store from "/models/Store";
import MenuSection from "/models/MenuSection";
import { IMenuSection } from "/models/types/MenuSection";

async function section(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storeId = req.query.storeId as string;
    const requestSection = req.body as IMenuSection;

    await connectToDatabase();

    if (req.method === "POST") {
      const created = await MenuSection.create({
        ...requestSection,
        store: storeId,
      });
      await Store.updateOne(
        { _id: storeId },
        { $push: { "menu.sections": created._id } }
      );
      res.status(200).json(created.toObject());
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export default section;
