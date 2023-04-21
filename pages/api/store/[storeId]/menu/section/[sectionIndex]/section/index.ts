import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import Store from "/models/Store";

async function sectionSections(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storeId = req.query.storeId as string;
    const sectionIndex = req.query.sectionIndex as string;

    const sectionIndexSplit = sectionIndex.split(",");

    await connectToDatabase();

    if (req.method === "POST") {
      await Store.updateOne(
        { _id: storeId },
        {
          $push: {
            [`menu.sections.${sectionIndexSplit.join(".sections.")}.sections`]:
              [req.body],
          },
        }
      );
      res.status(200).end();
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export default sectionSections;
