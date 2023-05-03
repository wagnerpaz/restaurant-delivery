import { NextApiRequest, NextApiResponse } from "next";
import { GridFSBucket, ObjectId, BSON } from "mongodb";
import mongoose from "mongoose";

import connectToDatabase from "/lib/mongoose";

async function downloadImage(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.query.id as string;

    const conn = await connectToDatabase();

    const bucket = new GridFSBucket(conn.db, { bucketName: "images" });
    const file = await bucket.find({ _id: new ObjectId(id) }).toArray();
    if (file?.length === 0) {
      res.status(404).send("File not found");
      return;
    }

    const downloadStream = bucket.openDownloadStream(new ObjectId(id));
    const metadata = file[0].metadata as BSON.Document;

    downloadStream.on("error", (err) => {
      res.status(404).send("Not Found");
    });

    res.setHeader("Content-Type", metadata.mimetype);
    res.setHeader("Content-Length", metadata.size);
    res.setHeader("Cache-Control", "public, max-age=604800, immutable");

    downloadStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}

export default downloadImage;
