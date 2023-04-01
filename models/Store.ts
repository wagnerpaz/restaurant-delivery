import mongoose, { Document, models, Schema } from "mongoose";

import { IIngredient } from "./Ingredients";
import { IMenuItem } from "./MenuItem";

export interface IStore extends Document {
  name: string;
  logo?: mongoose.Types.ObjectId;
  slug: string;
  locations: ILocation[];
  menu: {
    sections: IMenuSection[];
  };
  ingredients: mongoose.Types.ObjectId[] | IIngredient[];
}

export interface IMenuSection {
  name: string;
  items: IMenuItem[];
}

export interface ILocation {
  address: string;
  number: string;
  neighborhood: string;
  state: string;
  city: string;
  postalCode: string;
}

const storeSchema: Schema = new mongoose.Schema<IStore>({
  name: { type: String, required: true },
  logo: {
    type: mongoose.Types.ObjectId,
    ref: "images.files",
    required: false,
  },
  slug: { type: String, required: true, unique: true },
  locations: [
    {
      address: String,
      number: String,
      neighborhood: String,
      state: String,
      city: String,
      postalCode: String,
    },
  ],
  menu: {
    sections: [
      {
        name: String,
        items: [{ type: mongoose.Types.ObjectId, ref: "MenuItem" }],
      },
    ],
  },
  ingredients: [{ type: mongoose.Types.ObjectId, ref: "Ingredient" }],
});

const Store = models.Store || mongoose.model<IStore>("Store", storeSchema);

export default Store;
