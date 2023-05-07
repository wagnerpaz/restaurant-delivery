import mongoose, { models } from "mongoose";

import { IUser } from "./types/User";

const schema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  emailVerified: {
    type: Date,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
  },
  locations: [
    {
      address: String,
      number: String,
      neighborhood: String,
      state: String,
      city: String,
      postalCode: String,
      address2: String,
      main: Boolean,
    },
  ],
});

const User = models.User || mongoose.model<IUser>("User", schema);

export default User;
