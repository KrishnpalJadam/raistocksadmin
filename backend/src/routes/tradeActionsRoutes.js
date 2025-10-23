// routes/tradeAction.routes.ts
import express from "express";
import {
  addTradeAction,
  getTradeActions,
} from "../controllers/tradeActionsController.js";

const router = express.Router();

// POST → Add action to a trade (tradeId in params)
router.post("/:tradeId", addTradeAction);

// GET → Get all actions for a specific trade
router.get("/:tradeId", getTradeActions);

export default router;
