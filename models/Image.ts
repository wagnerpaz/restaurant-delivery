import mongoose, { Document, models, Schema } from "mongoose";

interface IImage extends Document {
  file: mongoose.Types.ObjectId;
}

const imageSchema: Schema = new mongoose.Schema({
  file: {
    type: mongoose.Types.ObjectId,
    ref: "uploads.files",
    required: true,
  },
});

const Image = models.Image || mongoose.model<IImage>("Image", imageSchema);

export default Image;
