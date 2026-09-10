import { Router } from "express";
import { applicationController } from "../controllers/applicationController.js";

const router = Router();

router.get("/applications/:id", (req, res) => applicationController.getApplication(req, res));
router.get("/applications/:id/department-data", (req, res) => applicationController.getDepartmentData(req, res));
router.post("/applications/:id/verify", (req, res) => applicationController.verifyApplication(req, res));

export default router;
