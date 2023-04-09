import mongoose, { Document, models, Schema } from "mongoose";

export interface IIngredient {
  name: string;
}

const ingredientsSchema: Schema = new mongoose.Schema({
  name: String,
});

const Ingredients =
  models.Ingredient ||
  mongoose.model<IIngredient>("Ingredient", ingredientsSchema);

export default Ingredients;
