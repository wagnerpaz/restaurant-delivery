import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoose from "mongoose";

import connectToDatabase from "/lib/mongoose";
import "models/User";

connectToDatabase();

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_PROVIDER_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_PROVIDER_GOOGLE_SECRET as string,
    }),
    // ...add more providers here
  ],
  adapter: MongoDBAdapter(Promise.resolve(mongoose.connection.getClient())),
  callbacks: {
    async session({ session, user }) {
      return Promise.resolve({
        ...session,
        user: {
          ...session.user,
          ...user,
        },
      });
    },
  },
};

export default NextAuth(authOptions);
