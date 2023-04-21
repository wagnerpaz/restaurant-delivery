import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import Ingredients from "/models/Ingredients";

async function updateDeleteIngredient(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = req.query.ingredientId as string;

    await connectToDatabase();

    if (req.method === "POST" || req.method === "PUT") {
      await Ingredients.findOneAndUpdate({ _id: id }, req.body);
      res.status(200).end();
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export default updateDeleteIngredient;
