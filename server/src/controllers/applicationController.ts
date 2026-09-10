import { Request, Response } from "express";
import { DEMO_APPLICATION } from "../data/demoCitizen.js";
import { departmentService } from "../services/departmentService.js";
import { orchestratorService } from "../services/orchestratorService.js";

/**
 * APPLICATION CONTROLLER (Section 11)
 * Clean separation of concerns: Handles HTTP request/response handling only.
 * Delegates all domain logic to services and orchestrator.
 */
export class ApplicationController {
  /**
   * GET /api/applications/:id
   * Fetch demo citizen application
   */
  async getApplication(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (id !== DEMO_APPLICATION.applicationId) {
      res.status(404).json({
        error: `Application not found: ${id}. For Phase 1 demo, please use ${DEMO_APPLICATION.applicationId}`
      });
      return;
    }

    res.status(200).json(DEMO_APPLICATION);
  }

  /**
   * GET /api/applications/:id/department-data
   * Returns raw heterogeneous data directly from the 4 department APIs
   */
  async getDepartmentData(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (id !== DEMO_APPLICATION.applicationId) {
      res.status(404).json({
        error: `Application not found: ${id}`
      });
      return;
    }

    try {
      const rawData = await departmentService.fetchAllRawDepartmentData(DEMO_APPLICATION.citizenId);
      res.status(200).json({
        applicationId: id,
        citizenId: DEMO_APPLICATION.citizenId,
        departmentRawResponses: rawData
      });
    } catch (err: any) {
      res.status(500).json({
        error: "Failed to query simulated department systems",
        details: err?.message
      });
    }
  }

  /**
   * POST /api/applications/:id/verify
   * Runs the complete pipeline:
   * 1. load application
   * 2. fetch department data
   * 3. run adapters
   * 4. normalize data
   * 5. compare data
   * 6. generate verification results
   * 7. generate summary
   */
  async verifyApplication(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (id !== DEMO_APPLICATION.applicationId) {
      res.status(404).json({
        error: `Application not found: ${id}`
      });
      return;
    }

    try {
      const verificationResult = await orchestratorService.verifyApplication(DEMO_APPLICATION);
      res.status(200).json(verificationResult);
    } catch (err: any) {
      res.status(500).json({
        error: "Verification pipeline execution failure",
        details: err?.message
      });
    }
  }
}

export const applicationController = new ApplicationController();
