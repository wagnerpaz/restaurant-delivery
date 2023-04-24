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
  additionals?: IMenuItemAdditionalsCategory[];
  sides?: ISidesItem[];
}

export interface IMenuItemCompositionItem {
  id?: string;
  ingredient: IIngredient;
  essential?: boolean;
  quantity?: number;
  unitPrice?: number;
}

export interface IMenuItemAdditionalsCategory {
  id?: string;
  categoryName?: string;
  min?: number;
  max?: number;
  items?: IMenuItemAdditionalsItem[];
}

export interface IMenuItemAdditionalsItem {
  id?: string;
  ingredient: IIngredient;
  min?: number;
  max?: number;
}

export interface ISidesItem {
  menuItem: IMenuItem;
  quantity?: number;
  essential?: boolean;
  exchanges?: IExchangesItem[];
}

export interface IExchangesItem {
  scope: "menu-section" | "menu-item";
  menuSectionIndex?: string;
  menuItem?: mongoose.Types.ObjectId;
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
      unitPrice: Number,
    },
  ],
  additionals: [
    {
      categoryName: String,
      min: Number,
      max: Number,
      items: [
        {
          ingredient: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Ingredient",
          },
          min: Number,
          max: Number,
        },
      ],
    },
  ],
  sides: [
    {
      menuItem: { type: mongoose.Types.ObjectId, ref: "MenuItem" },
      quantity: { type: Number, required: false },
      essential: { type: Boolean, required: false },
      exchanges: [
        {
          scope: { type: String, required: true },
          menuSectionIndex: String,
          menuItem: mongoose.Types.ObjectId,
        },
      ],
    },
  ],
});

const MenuItem =
  models.MenuItem ||
  mongoose.model<IMenuItem>("MenuItem", menuItemSchema, "menus.items");

export default MenuItem;
