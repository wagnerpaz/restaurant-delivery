import mongoose, { Document, models, Schema } from "mongoose";

export interface IIngredient extends Document {
  name: string;
}

const ingredientsSchema: Schema = new mongoose.Schema({
  name: { type: String, unique: true },
});

const Ingredients =
  models.Ingredient ||
  mongoose.model<IIngredient>("Ingredient", ingredientsSchema);

export default Ingredients;
