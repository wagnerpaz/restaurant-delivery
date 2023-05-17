import mongoose, { models } from "mongoose";

import { IMenuSection } from "./types/MenuSection";

const schema = new mongoose.Schema<IMenuSection>({
  store: { type: mongoose.Types.ObjectId, ref: "Store" },
  parentSection: { type: mongoose.Types.ObjectId, ref: "MenuSection" },
  name: String,
  editModeProduct: {
    type: String,
    required: true,
    enum: ["realistic", "fast"],
    default: "realistic",
  },
  editModeIngredient: {
    type: String,
    required: true,
    enum: ["realistic", "fast"],
    default: "fast",
  },
  retracted: Boolean,
  items: [{ type: mongoose.Types.ObjectId, ref: "MenuItem" }],
});

const MenuSection =
  models.MenuSection ||
  mongoose.model<IMenuSection>("MenuSection", schema, "menu.sections");

export default MenuSection;
