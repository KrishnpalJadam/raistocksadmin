// models/tradeAction.model.ts
import mongoose from "mongoose";

const tradeActionSchema = new mongoose.Schema(
  {
    tradeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trade", // 🔗 Reference to Trade model
      required: true,
    },
    type: {
      type: String,
      // allow 'exit' as a valid action type so frontend can send Exit actions
      enum: ["update", "book_profit", "stoploss_hit", "exit"],
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    comment: { type: String, default: "" },
    actionDateTime: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("TradeAction", tradeActionSchema);
