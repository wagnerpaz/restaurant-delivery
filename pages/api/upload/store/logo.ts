import mongoose from "mongoose";

import upload from "/middlewares/api/upload";
import Store from "/models/Store";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = upload(["logo"], async (req, res, results) => {
  const store = await Store.findById({ _id: req.query.id });
  if (store) {
    store.logo = new mongoose.Types.ObjectId(results["logo"].id);
    store.save();
    res.status(200).json(store);
  } else {
    res.status(404).end();
  }
});

export default handler;
