import express from "express";
import {
  createMarketInsight,
  getAllMarketInsights,
  getMarketInsightById,
  updateMarketInsight,
  deleteMarketInsight,
} from "../controllers/marketInsightController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.route("/")
  .get(getAllMarketInsights)      // GET all insights
  .post(protect, createMarketInsight);     // POST a new insight

router.route("/:id")
  .get( getMarketInsightById)      // GET single insight
  .put(updateMarketInsight)       // UPDATE insight
  .delete(deleteMarketInsight);   // DELETE insight

export default router;
