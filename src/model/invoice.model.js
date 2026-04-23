import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: String,
    quantity: Number,
    price: Number,
    total: Number,
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    postCode: String,
    country: String,
  },
  { _id: false },
);

const Invoice = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },

    createdAt: { type: Date, required: true },
    paymentDue: { type: Date, required: true },
    paymentTerms: { type: Number, required: true },

    description: String,

    status: {
      type: String,
      enum: ["draft", "pending", "paid"],
      default: "draft",
    },

    senderAddress: addressSchema,

    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientAddress: addressSchema,

    items: {
      type: [itemSchema],
      validate: [(val) => val.length > 0, "At least one item required"],
    },

    total: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Invoice", Invoice);
