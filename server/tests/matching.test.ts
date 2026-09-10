import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { matchingService } from "../src/services/matchingService.js";
import { DEMO_APPLICATION } from "../src/data/demoCitizen.js";

describe("Matching Engine Verification", () => {
  it("6. Field matching compares strings and numbers with field-level details", () => {
    const stringComparison = matchingService.compareField(
      "fullName",
      "Aarav Sharma",
      "aarav sharma "
    );
    assert.equal(stringComparison.match, true);
    assert.equal(stringComparison.field, "fullName");

    const numberComparison = matchingService.compareField(
      "annualIncome",
      180000,
      180000,
      "number"
    );
    assert.equal(numberComparison.match, true);
  });

  it("7. Returns VERIFIED when all fields match citizen data", () => {
    const normalizedIdentity = {
      citizenId: "CIT-001",
      fullName: "Aarav Sharma",
      fatherName: "Rajesh Kumar Sharma",
      dateOfBirth: "2007-05-12"
    };

    const result = matchingService.verifyIdentity(DEMO_APPLICATION, normalizedIdentity);
    assert.equal(result.status, "VERIFIED");
    assert.equal(result.matchedFields.length, 3);
    assert.equal(result.mismatchedFields.length, 0);
  });

  it("8. Returns UNVERIFIED when a discrepancy exists between citizen data and department", () => {
    const mismatchedIncome = {
      citizenId: "CIT-001",
      fullName: "Aarav Sharma",
      annualIncome: 350000, // Discrepancy! Application submitted 180000
      incomeCertificateNumber: "INC-MP-2026-001"
    };

    const result = matchingService.verifyIncome(DEMO_APPLICATION, mismatchedIncome);
    assert.equal(result.status, "UNVERIFIED");
    assert.equal(result.mismatchedFields.length, 1);
    assert.equal(result.mismatchedFields[0].field, "annualIncome");
    assert.equal(result.mismatchedFields[0].submitted, 180000);
    assert.equal(result.mismatchedFields[0].department, 350000);
  });
});
