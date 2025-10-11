import express from "express";
import {
  createGlobalMarket,
  getGlobalMarkets,
  getGlobalMarketById,
  updateGlobalMarket,
  deleteGlobalMarket,
} from "../controllers/globalMarketController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes
router.route("/")
  .get(getGlobalMarkets)       // GET all entries
  .post(protect, createGlobalMarket);   // POST new entry

router.route("/:id")
  .get(getGlobalMarketById)    // GET single entry by ID
  .put(updateGlobalMarket)     // UPDATE entry
  .delete(deleteGlobalMarket); // DELETE entry

export default router;
