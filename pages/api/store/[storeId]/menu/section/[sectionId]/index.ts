import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import Store from "/models/Store";
import { IMenuSection } from "/models/types/MenuSection";
import MenuSection from "/models/MenuSection";

async function section(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sectionId = req.query.sectionId as string;
    const requestSection = req.body as IMenuSection;

    await connectToDatabase();

    if (req.method === "PUT") {
      const updated = await MenuSection.findOne({ _id: sectionId })
        .populate("items")
        .exec();
      Object.assign(updated, { ...requestSection, items: updated.items });
      updated.save();
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
