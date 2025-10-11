import mongoose from "mongoose";

const marketInsightModel = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    currency: {
      type: Number,
      required: [true, "Currency is required"],
    },
    value: {
      type: String,
      required: [true, "Value is required"],
    },
    comment: {
      type: String,
        },
    date: {
      type: Date,
      default: Date.now,
    },
 
  },
  { timestamps: true }
);

const MarketInsight = mongoose.model("MarketInsight", marketInsightModel);
export default MarketInsight;
