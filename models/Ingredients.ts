import mongoose, { Document, models, Schema } from "mongoose";

export interface IIngredient extends Document {
  name: string;
}

const ingredientsSchema: Schema = new mongoose.Schema({
  name: String,
});

const Ingredients =
  models.Ingredients ||
  mongoose.model<IIngredient>("Ingredients", ingredientsSchema);

export default Ingredients;
