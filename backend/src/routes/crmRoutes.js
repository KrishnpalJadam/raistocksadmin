import express from "express";
import {
  createCRM,
  getAllCRM,
  getCRMById,
  updateCRM,
  deleteCRM,
} from "../controllers/crmusersController.js";

const router = express.Router();

// ✅ Admin-only CRM routes
router.route("/")
  .post(createCRM) // Create CRM user
  .get(getAllCRM); // Get all CRM users

router.route("/:id")
  .get(getCRMById) // Get single user
  .put(updateCRM)  // Update
  .delete(deleteCRM); // Delete

export default router;
