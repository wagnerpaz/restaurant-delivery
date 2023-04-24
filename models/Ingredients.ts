import mongoose, { Document, models, Schema } from "mongoose";

export interface IIngredient extends Document {
  name: string;
  store: mongoose.Types.ObjectId;
}

const ingredientsSchema: Schema = new mongoose.Schema({
  name: { type: String, unique: true },
  store: { type: mongoose.Types.ObjectId },
});

const Ingredients =
  models.Ingredient ||
  mongoose.model<IIngredient>("Ingredient", ingredientsSchema);

export default Ingredients;
