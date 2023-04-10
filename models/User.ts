import mongoose, { model, models } from "mongoose";
import type { AdapterUser } from "next-auth/adapters";

export interface IUser extends AdapterUser {
  role: string;
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
});

const User = models.User || mongoose.model<AdapterUser>("User", schema);

export default User;
