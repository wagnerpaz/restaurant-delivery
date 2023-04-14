import mongoose, { Document, models, Schema } from "mongoose";
import { IIngredient } from "./Ingredients";

export interface IMenuItem {
  name: string;
  nameDetail: string;
  images: {
    main?: mongoose.Types.ObjectId;
    others?: mongoose.Types.ObjectId[];
  };
  details: {
    short?: string;
    long?: string;
  };
  price: number;
  composition: IMenuItemCompositionItem[];
  sides?: ISidesItem[];
}

export interface IMenuItemCompositionItem {
  id?: string;
  ingredient: IIngredient;
  essential?: boolean;
  quantity?: number;
}

export interface ISidesItem {
  menuItem: IMenuItem;
  quantity?: number;
}

const menuItemSchema: Schema = new mongoose.Schema<IMenuItem>({
  name: String,
  nameDetail: String,
  images: {
    main: {
      type: mongoose.Types.ObjectId,
      ref: "images.files",
      required: false,
    },
    others: [
      {
        type: mongoose.Types.ObjectId,
        ref: "images.files",
        required: false,
      },
    ],
  },
  details: {
    short: { type: String, required: false },
    long: { type: String, required: false },
  },
  price: Number,
  composition: [
    {
      ingredient: {
        type: mongoose.Types.ObjectId,
        ref: "Ingredient",
      },
      essential: { type: Boolean, required: false },
      quantity: { type: Number, required: false },
    },
  ],
  sides: [
    {
      menuItem: { type: mongoose.Types.ObjectId, ref: "MenuItem" },
      quantity: { type: Number, required: false },
    },
  ],
});

const MenuItem =
  models.MenuItem ||
  mongoose.model<IMenuItem>("MenuItem", menuItemSchema, "menus.items");

export default MenuItem;
