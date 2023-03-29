//SINGLETON FOR GETTING A SINGLE CONNECTION WITH MONGODB

import mongoose, { Connection, ConnectOptions } from "mongoose";

interface Global {
  mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

declare const global: Global;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions)
      .then((mongoose) => {
        console.log("Connected to db");
        return mongoose.connection;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
