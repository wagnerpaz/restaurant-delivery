import formidable, { File, Files } from "formidable";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import sharp from "sharp";

import connectToDatabase from "/lib/mongoose";

export interface IUploadFileResult {
  id: mongoose.Types.ObjectId;
}

const upload = (
  fileKeys: string[],
  onSuccess: (
    req: NextApiRequest,
    res: NextApiResponse,
    filesResult: { [key: string]: mongoose.Types.ObjectId }
  ) => void
) => {
  async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (["PUT", "POST"].includes(req.method as string)) {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error(err);
          res.status(500).json(err);
          return;
        }

        if (!equalSetsArray(fileKeys, Object.keys(files))) {
          res.status(400).json({
            message: `FormData should contain the following files: [${fileKeys}]`,
          });
        }

        try {
          const conn = await connectToDatabase();

          const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: "images",
          });

          const promises: any[] = [];
          Object.keys(files).forEach((fileKey) => {
            promises.push(streamFile(bucket, files, fileKey));
          });
          const promisesResults = await Promise.all(promises);
          const result = promisesResults.reduce(
            (res, cur, index) => ({
              ...res,
              [Object.keys(files)[index]]: cur,
            }),
            {}
          );
          onSuccess(req, res, result);
        } catch (err) {
          console.error(err);
          res.status(500).json(err);
        }
      });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  }
  return handler;
};

const streamFile = (
  bucket: mongoose.mongo.GridFSBucket,
  files: Files,
  fileKey: string
) => {
  return new Promise((resolve, reject) => {
    const file = files[fileKey] as File;
    const stream = bucket.openUploadStream(file.newFilename, {
      metadata: file,
    });
    const readStream = fs.createReadStream(file.filepath);

    const sharpObject = sharp();
    readStream.pipe(sharpObject);

    const webpOptions = { quality: 80 };
    sharpObject.webp(webpOptions);

    sharpObject.pipe(stream);

    stream.on("error", (err) => {
      console.error(err);
      reject(err);
    });

    stream.on("finish", () => {
      resolve(stream.id);
    });
  });
};

const equalSetsArray = (arr1: any[], arr2: any[]) => {
  // Sort the arrays before comparing
  const sortedArr1 = arr1.sort();
  const sortedArr2 = arr2.sort();

  const areEqual =
    sortedArr1.length === sortedArr2.length &&
    sortedArr1.every((value, index) => value === sortedArr2[index]);

  return areEqual;
};

export default upload;
