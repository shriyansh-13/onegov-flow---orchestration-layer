import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { OrchestratorService } from "../src/services/orchestratorService.js";
import { DepartmentService } from "../src/services/departmentService.js";
import { DEMO_APPLICATION } from "../src/data/demoCitizen.js";

describe("Orchestrator Pipeline & Fault Isolation", () => {
  it("Runs the complete 4-department verification pipeline successfully", async () => {
    const orchestrator = new OrchestratorService();
    const result = await orchestrator.verifyApplication(DEMO_APPLICATION);

    assert.equal(result.applicationId, "APP-DEMO-001");
    assert.equal(result.summary.required, 4);
    assert.equal(result.summary.verified, 4);
    assert.equal(result.summary.unverified, 0);
    assert.equal(result.summary.status, "VERIFICATION_COMPLETE");

    // Verify raw data and normalized data are preserved for evaluator inspection
    for (const domainRes of result.domainResults) {
      assert.ok(domainRes.rawData, `Raw data must be preserved for ${domainRes.domain}`);
      assert.ok(domainRes.normalizedData, `Normalized data must be preserved for ${domainRes.domain}`);
      assert.equal(domainRes.verification.status, "VERIFIED");
    }
  });

  it("10. One failed department does not crash the whole pipeline", async () => {
    // Subclass or mock department service to simulate Income System outage
    class FaultyDepartmentService extends DepartmentService {
      override async fetchIncomeData(): Promise<any> {
        throw new Error("Income Tax Server 503: Gateway Connection Timeout");
      }
    }

    const faultyOrchestrator = new OrchestratorService(new FaultyDepartmentService());
    const result = await faultyOrchestrator.verifyApplication(DEMO_APPLICATION);

    assert.equal(result.applicationId, "APP-DEMO-001");
    assert.equal(result.summary.required, 4);
    assert.equal(result.summary.verified, 3);
    assert.equal(result.summary.unavailable, 1);
    assert.equal(result.summary.status, "VERIFICATION_INCOMPLETE");

    const incomeResult = result.domainResults.find((d) => d.domain === "INCOME");
    assert.ok(incomeResult, "Income domain result should exist");
    assert.equal(incomeResult?.verification.status, "UNAVAILABLE");
    assert.match(incomeResult?.verification.error || "", /Income Tax Server 503/);

    // Other 3 domains must still be verified!
    const identityResult = result.domainResults.find((d) => d.domain === "IDENTITY");
    assert.equal(identityResult?.verification.status, "VERIFIED");

    const educationResult = result.domainResults.find((d) => d.domain === "EDUCATION");
    assert.equal(educationResult?.verification.status, "VERIFIED");

    const documentResult = result.domainResults.find((d) => d.domain === "DOCUMENTS");
    assert.equal(documentResult?.verification.status, "VERIFIED");
  });
});
