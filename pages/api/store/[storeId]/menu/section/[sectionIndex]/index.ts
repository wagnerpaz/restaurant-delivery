import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import Store from "/models/Store";
import { IMenuSection } from "/models/types/Store";
import { navigateBySectionIndex } from "/lib/menuSectionUtils";

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
            [`menu.sections.${sectionIndexSplit.join(".sections.")}.editMode`]:
              requestSection.editMode,
            [`menu.sections.${sectionIndexSplit.join(".sections.")}.retracted`]:
              requestSection.retracted,
          },
        }
      );

      const store = Store.findOne(
        { _id: storeId },
        { [`menu.sections.${sectionIndexSplit.join(".sections.")}`]: 1 }
      );
      res.status(200).json(
        navigateBySectionIndex(
          store.sections,
          sectionIndexSplit.map((m) => +m)
        )
      );
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
