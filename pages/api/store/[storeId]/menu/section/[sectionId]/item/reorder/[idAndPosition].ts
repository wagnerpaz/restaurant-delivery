import { NextApiRequest, NextApiResponse } from "next";
import { moveTo } from "/lib/immutable";

import connectToDatabase from "/lib/mongoose";
import MenuSection from "/models/MenuSection";

async function reorderMenuItems(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const sectionId = req.query.sectionId as string;
    const idAndPosition = req.query.idAndPosition as string;

    const idAndPositionSplit = idAndPosition.split(",");

    const id1 = idAndPositionSplit[0];
    const atIndex = idAndPositionSplit[1];

    if (req.method === "POST" || req.method === "PUT") {
      const section = await MenuSection.findById(sectionId);

      const foundIndex = section.items.findIndex(
        (f) => f?._id?.toString() === id1
      );
      if (foundIndex >= 0) {
        section.items = moveTo(section.items, foundIndex, +atIndex);

        section.save();
      } else {
        res.status(404).end();
      }

      res.status(200).json(section);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export default reorderMenuItems;
