import mongoose from "mongoose";

import upload from "/middlewares/api/upload";
import MenuItem from "/models/MenuItem";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = upload(["file"], async (req, res, results) => {
  res.status(200).json({ _id: results["file"].toString() });
});

export default handler;
