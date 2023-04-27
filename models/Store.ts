import mongoose, { Document, models, Schema } from "mongoose";

import { IIngredient } from "./Ingredients";
import { IMenuItem } from "./MenuItem";

export interface IStore extends Document {
  name: string;
  logo?: mongoose.Types.ObjectId;
  slug: string;
  listed: boolean;
  locations: ILocation[];
  menu: {
    sections: IMenuSection[];
  };
  ingredients: IStoreIngredient[];
}

export interface IStoreIngredient {
  ingredient: IIngredient;
  price?: number;
}

export interface IMenuSection {
  name: string;
  items: IMenuItem[];
  sections: IMenuSection[];
}

export interface ILocation {
  address: string;
  address2: string;
  number: string;
  neighborhood: string;
  state: string;
  city: string;
  postalCode: string;
  main?: boolean;
}

const storeSchema: Schema = new mongoose.Schema<IStore>({
  name: { type: String, required: true },
  logo: {
    type: mongoose.Types.ObjectId,
    ref: "images.files",
    required: false,
  },
  slug: { type: String, required: true, unique: true },
  listed: { type: Boolean, required: true, default: false },
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
  ingredients: [
    {
      ingredient: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Ingredient",
      },
      price: Number,
    },
  ],
  menu: {
    //five levels of nested sections
    sections: [
      {
        name: String,
        items: [{ type: mongoose.Types.ObjectId, ref: "MenuItem" }],
        sections: [
          {
            name: String,
            items: [{ type: mongoose.Types.ObjectId, ref: "MenuItem" }],
            sections: [
              {
                name: String,
                items: [{ type: mongoose.Types.ObjectId, ref: "MenuItem" }],
                sections: [
                  {
                    name: String,
                    items: [{ type: mongoose.Types.ObjectId, ref: "MenuItem" }],
                    sections: [
                      {
                        name: String,
                        items: [
                          { type: mongoose.Types.ObjectId, ref: "MenuItem" },
                        ],
                        sections: [
                          {
                            name: String,
                            items: [
                              {
                                type: mongoose.Types.ObjectId,
                                ref: "MenuItem",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});

const Store = models.Store || mongoose.model<IStore>("Store", storeSchema);

export default Store;
