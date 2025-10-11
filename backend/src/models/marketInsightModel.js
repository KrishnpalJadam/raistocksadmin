import mongoose from "mongoose";

const marketInsightModel = new mongoose.Schema(
  {
    marketInfo: {
      type: String,
      required: [true, "marketInfo is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    comment: {
      type: String,
    },
    sentiment: {
      type: String,
      enum: ["Positive", "Negative"],
      required: [true, "Sentiment is required"],
      default: "Neutral",
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
