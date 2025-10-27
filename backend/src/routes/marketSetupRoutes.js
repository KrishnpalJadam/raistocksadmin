import express from "express";
import {
  createMarketSetup,
  getMarketSetups,
  getMarketSetupById,
  deleteMarketSetup,
} from "../controllers/marketSetupController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), createMarketSetup);
router.get("/", getMarketSetups);
router.get("/:id", getMarketSetupById);
router.delete("/:id", deleteMarketSetup);

export default router;
