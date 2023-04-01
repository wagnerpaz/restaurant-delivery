import mongoose from "mongoose";

import upload from "/middlewares/api/upload";
import MenuItem from "/models/MenuItem";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = upload(["main"], async (req, res, results) => {
  console.log(results, typeof results["main"]);
  const menuItem = await MenuItem.findById({ _id: req.query.id });
  if (menuItem) {
    menuItem.images.main = results["main"];
    menuItem.save();
    res.status(200).json(menuItem);
  } else {
    res.status(404).end();
  }
});

export default handler;
