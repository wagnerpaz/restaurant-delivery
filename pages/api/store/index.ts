import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "/lib/mongoose";
import Store, { IStore } from "/models/Store";

async function createStore(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    const bodyStore = req.body as IStore;

    if (req.method === "POST" || req.method === "PUT") {
      const foundStore = await Store.findOne({ slug: bodyStore.slug }).exec();
      if (foundStore) {
        foundStore.name = bodyStore.name;
        foundStore.logo = bodyStore.logo;
        foundStore.locations = bodyStore.locations;
        foundStore.save();
        res.status(200).json(foundStore.toObject());
      } else {
        const createdStore = await Store.create(bodyStore);
        const serverStore = await Store.findById(createdStore._id);
        res.status(200).json(serverStore.toObject());
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

export default createStore;
