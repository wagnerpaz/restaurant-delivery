import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import Store from "/models/Store";

async function section(req: NextApiRequest, res: NextApiResponse) {
  try {
    const storeId = req.query.storeId as string;

    await connectToDatabase();

    if (req.method === "POST") {
      await Store.updateOne(
        { _id: storeId },
        {
          $push: {
            [`menu.sections`]: [req.body],
          },
        }
      );
      res.status(200).end();
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

export default section;
