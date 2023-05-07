import formidable, { File } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import tinify from "tinify";
import AWS from "aws-sdk";

import { areSetsEquals } from "/lib/arraySets";

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY as string,
  secretAccessKey: process.env.S3_SECRET_KEY as string,
});
const bucketName = process.env.S3_BUCKET_NAME as string;

tinify.key = process.env.TINIFY_API_KEY as string;

const upload = (
  fileKeys: string[],
  onSuccess: (
    req: NextApiRequest,
    res: NextApiResponse,
    filesResult: { [key: string]: string }
  ) => void
) =>
  async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (["PUT", "POST"].includes(req.method as string)) {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error(err);
          res.status(500).json(err);
          return;
        }

        if (!areSetsEquals(fileKeys, Object.keys(files))) {
          res.status(400).json({
            message: `FormData should contain the following files: [${fileKeys}]`,
          });
        }

        try {
          const promises: any[] = [];
          for (const fileKey of Object.keys(files)) {
            const file = files[fileKey] as File;

            //Compress and resize to width 500
            const compressedImage = tinify.fromFile(file.filepath);
            compressedImage.resize({ method: "scale", width: 500 });
            const resultImage = await compressedImage.toBuffer();

            const fileName = `${file.newFilename}-${file.originalFilename}`;
            // upload the file to S3
            promises.push(
              s3
                .upload({
                  Bucket: bucketName,
                  Key: fileName,
                  Body: resultImage,
                  ContentType: file.mimetype as string,
                  CacheControl: "max-age=31536000",
                })
                .promise()
            );
          }
          const promisesResults = await Promise.all(promises);
          const result = promisesResults.reduce(
            (res, cur, index) => ({
              ...res,
              [Object.keys(files)[index]]: cur.Key,
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
  };

export default upload;
