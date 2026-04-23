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

const invoiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },

    createdAt: {
      type: Date,
      required: function () {
        return this.status !== "draft";
      },
    },

    paymentDue: {
      type: Date,
      required: function () {
        return this.status !== "draft";
      },
    },

    paymentTerms: {
      type: Number,
      required: function () {
        return this.status !== "draft";
      },
    },

    description: String,

    status: {
      type: String,
      enum: ["draft", "pending", "paid"],
      default: "draft",
    },

    senderAddress: addressSchema,

    clientName: {
      type: String,
      required: function () {
        return this.status !== "draft";
      },
    },

    clientEmail: {
      type: String,
      required: function () {
        return this.status !== "draft";
      },
    },

    clientAddress: addressSchema,

    items: {
      type: [itemSchema],
      validate: {
        validator: function (val) {
          if (this.status === "draft") return true;
          return val.length > 0;
        },
        message: "At least one item required",
      },
    },

    total: {
      type: Number,
      required: function () {
        return this.status !== "draft";
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Invoice", invoiceSchema);
