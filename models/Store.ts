import mongoose, { models, Schema } from "mongoose";

import { IStore } from "./types/Store";

const storeSchema: Schema = new mongoose.Schema<IStore>({
  active: Boolean,
  name: { type: String, required: true },
  logo: {
    type: String,
    required: false,
  },
  slug: { type: String, required: true, unique: true },
  listed: { type: Boolean, required: true, default: false },
  description: { type: String, required: false },
  locations: [
    {
      address: String,
      number: String,
      neighborhood: String,
      state: String,
      city: String,
      postalCode: String,
      address2: String,
      main: Boolean,
    },
  ],
  menu: {
    sections: [{ type: mongoose.Types.ObjectId, ref: "MenuSection" }],
  },
  theme: {
    colors: {
      hero: String,
    },
  },
});

const Store = models.Store || mongoose.model<IStore>("Store", storeSchema);

export default Store;
