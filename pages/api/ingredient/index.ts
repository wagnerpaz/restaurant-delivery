import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import serializeJson from "/lib/serializeJson";
import Ingredients from "/models/Ingredients";

async function createIngredient(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    if (req.method === "POST") {
      await Ingredients.create(req.body);
      res.status(200).end();
    } else if (req.method === "GET") {
      const found = await Ingredients.find();
      const serialized = serializeJson(found.map((f) => f.toObject()));
      res.status(200).json(serialized);
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

export default createIngredient;
