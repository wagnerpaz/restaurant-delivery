import mongoose, { Document, models, Schema } from "mongoose";
import { IIngredient } from "./Ingredients";
import Store, { IMenuSection } from "./Store";

export interface IMenuItem {
  store: mongoose.Types.ObjectId;
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
  itemType: "product" | "ingredient" | "ingredient-group";
  composition?: IMenuItemCompositionItem[];
  customizeType: "template" | "individual";
  customizeTemplateSectionIndex: string;
  customizeTemplateMenuItem: IMenuItem;
  additionals?: IMenuItemAdditionalsCategory[];
  sides?: ISidesItem[];
}

export interface IMenuItemCompositionItem {
  id?: string;
  section?: string;
  ingredient?: IMenuItem;
  essential?: boolean;
  quantity?: number;
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
  sectionIndex: string;
  ingredient: IMenuItem;
  min?: number;
  max?: number;
  charge?: boolean;
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
  store: { type: mongoose.Types.ObjectId, required: true, ref: "Store" },
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
  itemType: {
    type: String,
    enum: ["product", "ingredient", "ingredient-group"],
    required: true,
  },
  composition: [
    {
      section: {
        type: String,
      },
      ingredient: {
        type: mongoose.Types.ObjectId,
        ref: "MenuItem",
      },
      essential: { type: Boolean, required: false },
      quantity: { type: Number, required: false },
    },
  ],
  customizeType: {
    type: String,
    enum: ["template", "individual"],
    default: "individual",
  },
  customizeTemplateSectionIndex: { type: String },
  customizeTemplateMenuItem: { type: mongoose.Types.ObjectId, ref: "MenuItem" },
  additionals: [
    {
      categoryName: String,
      min: Number,
      max: Number,
      items: [
        {
          sectionIndex: String,
          ingredient: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "MenuItem",
          },
          min: Number,
          max: Number,
          charge: { type: Boolean, default: true },
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
