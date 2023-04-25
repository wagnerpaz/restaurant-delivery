import mongoose, { models } from "mongoose";
import type { AdapterUser } from "next-auth/adapters";

import { ILocation } from "./Store";

export interface IUser extends AdapterUser {
  role: string;
  locations: ILocation[];
}

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
    },
  ],
});

const User = models.User || mongoose.model<AdapterUser>("User", schema);

export default User;
