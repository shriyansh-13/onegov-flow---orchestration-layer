import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  adaptIdentityData,
  adaptEducationData,
  adaptIncomeData,
  adaptDocumentData
} from "../src/adapters/index.js";
import {
  MOCK_IDENTITY_DATABASE,
  MOCK_EDUCATION_DATABASE,
  MOCK_INCOME_DATABASE,
  MOCK_DOCUMENT_DATABASE
} from "../src/data/mockDepartments.js";

describe("Department Adapter Layer Normalization", () => {
  it("1. Identity adapter converts uppercase keys & DD/MM/YYYY into Common Data Model", () => {
    const raw = MOCK_IDENTITY_DATABASE["CIT-001"];
    const normalized = adaptIdentityData(raw);

    assert.equal(normalized.citizenId, "CIT-001");
    assert.equal(normalized.fullName, "Aarav Sharma");
    assert.equal(normalized.fatherName, "Rajesh Kumar Sharma");
    assert.equal(normalized.dateOfBirth, "2007-05-12");
  });

  it("2. Education adapter converts camelCase & DD-MM-YYYY into Common Data Model", () => {
    const raw = MOCK_EDUCATION_DATABASE["CIT-001"];
    const normalized = adaptEducationData(raw);

    assert.equal(normalized.citizenId, "CIT-001");
    assert.equal(normalized.fullName, "Aarav Sharma");
    assert.equal(normalized.dateOfBirth, "2007-05-12");
    assert.equal(normalized.collegeName, "National Institute of Technology, Delhi");
  });

  it("3. Income adapter converts snake_case & number into Common Data Model", () => {
    const raw = MOCK_INCOME_DATABASE["CIT-001"];
    const normalized = adaptIncomeData(raw);

    assert.equal(normalized.citizenId, "CIT-001");
    assert.equal(normalized.fullName, "Aarav Sharma");
    assert.equal(normalized.annualIncome, 180000);
    assert.equal(normalized.incomeCertificateNumber, "INC-MP-2026-001");
    assert.equal(normalized.isValidRecord, true);
  });

  it("4. Document adapter extracts nested person and documents into Common Data Model", () => {
    const raw = MOCK_DOCUMENT_DATABASE["CIT-001"];
    const normalized = adaptDocumentData(raw);

    assert.equal(normalized.fullName, "Aarav Sharma");
    assert.equal(normalized.citizenId, "CIT-001");
    assert.equal(normalized.incomeCertificateNumber, "INC-MP-2026-001");
    assert.equal(normalized.documentStatuses?.["IDENTITY_PROOF"], "DOC_VALID");
    assert.equal(normalized.documentStatuses?.["INCOME_CERTIFICATE"], "DOC_VALID");
  });
});
