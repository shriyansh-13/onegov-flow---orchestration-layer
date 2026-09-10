import { Request, Response } from "express";

export function getHealth(req: Request, res: Response) {
  res.status(200).json({
    status: "ok",
    service: "OneGov Flow Orchestration Engine",
    phase: "Phase 1: Foundation + Demo Data Pipeline",
    timestamp: new Date().toISOString()
  });
}
