import mongoose, { models, Schema } from "mongoose";

import { IMenuItem } from "./types/MenuItem";

const menuItemSchema: Schema = new mongoose.Schema<IMenuItem>({
  store: { type: mongoose.Types.ObjectId, required: true, ref: "Store" },
  name: { type: String, required: true },
  nameDetail: String,
  images: {
    main: {
      type: String,
      required: false,
    },
    others: [
      {
        type: String,
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
