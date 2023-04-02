import { NextApiRequest, NextApiResponse } from "next";
import { GridFSBucket, ObjectId, BSON } from "mongodb";
import mongoose from "mongoose";

import connectToDatabase from "/lib/mongoose";
import Store from "/models/Store";

async function store(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.query.storeId as string;

    const conn = await connectToDatabase();

    console.log("req.body", JSON.stringify(req.body));

    await Store.findOneAndUpdate({ _id: id }, req.body, {
      upsert: true,
      new: true,
    });

    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

export default store;
