import formidable, { File, Files } from "formidable";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import tinify from "tinify";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY as string,
  secretAccessKey: process.env.S3_SECRET_KEY as string,
});

const bucketName = process.env.S3_BUCKET_NAME as string;

export interface IUploadFileResult {
  id: mongoose.Types.ObjectId;
}

tinify.key = "cyC8hn71gxKl4g3p8tnLtJmQGL3wKLdv";

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
          const promises: any[] = [];
          for (const fileKey of Object.keys(files)) {
            const file = files[fileKey] as File;
            const compressedImage = tinify.fromFile(file.filepath);
            compressedImage.resize({ method: "scale", width: 500 });
            const resultImage = await compressedImage.toBuffer();

            // upload the file to S3
            promises.push(
              s3
                .upload({
                  Bucket: bucketName,
                  Key: `${file.newFilename}`,
                  Body: resultImage,
                  ContentType: file.mimetype as string,
                })
                .promise()
            );
          }
          const promisesResults = await Promise.all(promises);
          const result = promisesResults.reduce(
            (res, cur, index) => ({
              ...res,
              [Object.keys(files)[index]]: cur.Location,
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
