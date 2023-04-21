import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import Store, { IMenuSection } from "/models/Store";

async function section(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storeId = req.query.storeId as string;
    const sectionIndex = req.query.sectionIndex as string;

    const sectionIndexSplit = sectionIndex.split(",");

    await connectToDatabase();

    const requestSection = req.body as IMenuSection;

    if (req.method === "PUT") {
      await Store.updateOne(
        { _id: storeId },
        {
          $set: {
            [`menu.sections.${sectionIndexSplit.join(".sections.")}.name`]:
              requestSection.name,
          },
        }
      );
      res.status(200).end();
    } else if (req.method === "DELETE") {
      const spliced = [...sectionIndexSplit];
      const lastIndex = spliced.splice(-1)[0];
      await Store.updateOne(
        { _id: storeId },
        {
          $unset: {
            [`menu.sections.${sectionIndexSplit.join(".sections.")}`]: "",
          },
        }
      );
      await Store.updateOne(
        { _id: storeId },
        {
          $pull: {
            [spliced.length > 1
              ? `menu.sections.${spliced.join(".sections.")}.sections`
              : "menu.sections"]: null,
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

export default section;
