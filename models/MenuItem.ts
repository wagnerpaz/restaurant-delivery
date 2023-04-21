import mongoose, { Document, models, Schema } from "mongoose";
import { IIngredient } from "./Ingredients";

export interface IMenuItem {
  name: string;
  nameDetail?: string;
  images?: {
    main?: mongoose.Types.ObjectId;
    others?: mongoose.Types.ObjectId[];
  };
  details?: {
    short?: string;
    long?: string;
  };
  price?: number;
  pricePromotional?: number;
  hidden?: boolean;
  composition?: IMenuItemCompositionItem[];
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
  essential?: boolean;
}

const menuItemSchema: Schema = new mongoose.Schema<IMenuItem>({
  name: { type: String, required: true },
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
  price: { type: Number, required: true },
  pricePromotional: { type: Number, required: false },
  hidden: { type: Boolean, required: false },
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
      essential: { type: Boolean, required: false },
    },
  ],
});

const MenuItem =
  models.MenuItem ||
  mongoose.model<IMenuItem>("MenuItem", menuItemSchema, "menus.items");

export default MenuItem;
