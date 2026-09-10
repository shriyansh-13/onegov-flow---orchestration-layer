import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { summaryService } from "../src/services/summaryService.js";
import { DomainVerificationResult } from "../src/models/departmentTypes.js";

describe("Verification Summary Service", () => {
  it("9. Calculates dynamic four-domain summary counts without hardcoding", () => {
    const mockDomainResults: DomainVerificationResult[] = [
      {
        domain: "IDENTITY",
        sourceSystem: "IDENTITY_SYSTEM",
        verification: { status: "VERIFIED", matchedFields: [], mismatchedFields: [] }
      },
      {
        domain: "EDUCATION",
        sourceSystem: "EDUCATION_SYSTEM",
        verification: { status: "VERIFIED", matchedFields: [], mismatchedFields: [] }
      },
      {
        domain: "INCOME",
        sourceSystem: "INCOME_SYSTEM",
        verification: { status: "VERIFIED", matchedFields: [], mismatchedFields: [] }
      },
      {
        domain: "DOCUMENTS",
        sourceSystem: "DOCUMENT_SYSTEM",
        verification: { status: "VERIFIED", matchedFields: [], mismatchedFields: [] }
      }
    ];

    const result = summaryService.compileSummary("APP-DEMO-001", mockDomainResults);

    assert.equal(result.summary.required, 4);
    assert.equal(result.summary.verified, 4);
    assert.equal(result.summary.unverified, 0);
    assert.equal(result.summary.unavailable, 0);
    assert.equal(result.summary.status, "VERIFICATION_COMPLETE");
    assert.equal(result.domains.length, 4);
  });

  it("Accurately counts unverified domains", () => {
    const mockDomainResults: DomainVerificationResult[] = [
      {
        domain: "IDENTITY",
        sourceSystem: "IDENTITY_SYSTEM",
        verification: { status: "VERIFIED", matchedFields: [], mismatchedFields: [] }
      },
      {
        domain: "EDUCATION",
        sourceSystem: "EDUCATION_SYSTEM",
        verification: { status: "UNVERIFIED", matchedFields: [], mismatchedFields: [] }
      },
      {
        domain: "INCOME",
        sourceSystem: "INCOME_SYSTEM",
        verification: { status: "VERIFIED", matchedFields: [], mismatchedFields: [] }
      },
      {
        domain: "DOCUMENTS",
        sourceSystem: "DOCUMENT_SYSTEM",
        verification: { status: "VERIFIED", matchedFields: [], mismatchedFields: [] }
      }
    ];

    const result = summaryService.compileSummary("APP-DEMO-001", mockDomainResults);

    assert.equal(result.summary.required, 4);
    assert.equal(result.summary.verified, 3);
    assert.equal(result.summary.unverified, 1);
    assert.equal(result.summary.status, "VERIFICATION_INCOMPLETE");
  });
});
