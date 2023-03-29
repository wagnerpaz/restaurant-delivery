import mongoose, { Document, models, Schema } from "mongoose";

interface IStore extends Document {
  name: string;
  logo?: mongoose.Types.ObjectId;
  locations: ILocation[];
}

interface ILocation {
  address: string;
  number: string;
  neighborhood: string;
  state: string;
  city: string;
  postalCode: string;
}

const storeSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: {
    type: mongoose.Types.ObjectId,
    ref: "images.files",
    required: false,
  },
  locations: [
    {
      address: String,
      number: String,
      neighborhood: String,
      state: String,
      city: String,
      postalCode: String,
    },
  ],
});

const Store = models.Store || mongoose.model<IStore>("Store", storeSchema);

export default Store;
