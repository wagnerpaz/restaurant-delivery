import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import Store from "/models/Store";
import { IMenuSection } from "/models/types/MenuSection";
import MenuSection from "/models/MenuSection";

async function section(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storeId = req.query.storeId as string;
    const sectionId = req.query.sectionId as string;
    const requestSection = req.body as IMenuSection;

    await connectToDatabase();

    if (req.method === "PUT") {
      const updated = await MenuSection.findById(sectionId);
      Object.assign(updated, requestSection);
      await updated.save();
      res.status(200).json(updated.toObject());
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export default section;
