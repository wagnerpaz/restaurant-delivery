import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import serializeJson from "/lib/serializeJson";
import Store from "/models/Store";

async function createIngredient(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();
    const storeId = req.query.storeId as string;

    if (req.method === "POST" || req.method === "PUT") {
      await Store.findByIdAndUpdate(storeId, {
        $set: { ingredients: req.body },
      });
      res.status(200).end();
    } else if (req.method === "GET") {
      const newStore = await Store.findById(storeId);
      await newStore.populate("ingredients");
      const serialized = serializeJson(newStore.ingredients);
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
