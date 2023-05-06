import mongoose, { models, Schema } from "mongoose";

import { IStore } from "./types/Store";

const storeSchema: Schema = new mongoose.Schema<IStore>({
  name: { type: String, required: true },
  logo: {
    type: String,
    required: false,
  },
  slug: { type: String, required: true, unique: true },
  listed: { type: Boolean, required: true, default: false },
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
  theme: {
    colors: {
      hero: String,
    },
  },
  menu: {
    //five levels of nested sections
    sections: [
      {
        name: String,
        editMode: {
          type: String,
          required: true,
          enum: ["realistic", "fast"],
          default: "realistic",
        },
        retracted: Boolean,
        items: [{ type: mongoose.Types.ObjectId, ref: "MenuItem" }],
        sections: [
          {
            name: String,
            editMode: {
              type: String,
              required: true,
              enum: ["realistic", "fast"],
              default: "realistic",
            },
            retracted: Boolean,
            items: [{ type: mongoose.Types.ObjectId, ref: "MenuItem" }],
            sections: [
              {
                name: String,
                editMode: {
                  type: String,
                  required: true,
                  enum: ["realistic", "fast"],
                  default: "realistic",
                },
                retracted: Boolean,
                items: [{ type: mongoose.Types.ObjectId, ref: "MenuItem" }],
                sections: [
                  {
                    name: String,
                    editMode: {
                      type: String,
                      required: true,
                      enum: ["realistic", "fast"],
                      default: "realistic",
                    },
                    retracted: Boolean,
                    items: [{ type: mongoose.Types.ObjectId, ref: "MenuItem" }],
                    sections: [
                      {
                        name: String,
                        editMode: {
                          type: String,
                          required: true,
                          enum: ["realistic", "fast"],
                          default: "realistic",
                        },
                        retracted: Boolean,
                        items: [
                          { type: mongoose.Types.ObjectId, ref: "MenuItem" },
                        ],
                        sections: [
                          {
                            name: String,
                            editMode: {
                              type: String,
                              required: true,
                              enum: ["realistic", "fast"],
                              default: "realistic",
                            },
                            retracted: Boolean,
                            items: [
                              {
                                type: mongoose.Types.ObjectId,
                                ref: "MenuItem",
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});

const Store = models.Store || mongoose.model<IStore>("Store", storeSchema);

export default Store;
