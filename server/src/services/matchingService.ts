import { CommonDataModel } from "../models/commonDataModel.js";
import {
  FieldComparison,
  VerificationStatus,
  DomainType
} from "../models/departmentTypes.js";

/**
 * MATCHING ENGINE (Section 9)
 * Performs precise field-level comparisons between citizen-submitted application data
 * and normalized Common Data Model representations from department adapters.
 */
export class MatchingService {
  /**
   * Compare two string values with case-insensitivity and whitespace normalization.
   */
  private compareString(valA: unknown, valB: unknown): boolean {
    if (valA === undefined || valB === undefined || valA === null || valB === null) {
      return false;
    }
    return String(valA).trim().toLowerCase() === String(valB).trim().toLowerCase();
  }

  /**
   * Compare numeric values.
   */
  private compareNumber(valA: unknown, valB: unknown): boolean {
    if (valA === undefined || valB === undefined || valA === null || valB === null) {
      return false;
    }
    return Number(valA) === Number(valB);
  }

  /**
   * Compare a single field and produce a FieldComparison result.
   */
  compareField(
    fieldName: string,
    submittedValue: unknown,
    departmentValue: unknown,
    type: "string" | "number" = "string"
  ): FieldComparison {
    const match =
      type === "number"
        ? this.compareNumber(submittedValue, departmentValue)
        : this.compareString(submittedValue, departmentValue);

    return {
      field: fieldName,
      submitted: submittedValue ?? null,
      department: departmentValue ?? null,
      match,
      remarks: match
        ? "Values match perfectly"
        : `Discrepancy detected: submitted "${submittedValue}" vs department "${departmentValue}"`
    };
  }

  /**
   * Domain 1: IDENTITY Checks
   * Required checks: fullName, fatherName, dateOfBirth
   */
  verifyIdentity(
    submitted: CommonDataModel,
    normalized: Partial<CommonDataModel>
  ): {
    status: VerificationStatus;
    matchedFields: FieldComparison[];
    mismatchedFields: FieldComparison[];
  } {
    const checks: FieldComparison[] = [
      this.compareField("fullName", submitted.fullName, normalized.fullName),
      this.compareField("fatherName", submitted.fatherName, normalized.fatherName),
      this.compareField("dateOfBirth", submitted.dateOfBirth, normalized.dateOfBirth)
    ];

    const matchedFields = checks.filter((c) => c.match);
    const mismatchedFields = checks.filter((c) => !c.match);
    const status: VerificationStatus = mismatchedFields.length === 0 ? "VERIFIED" : "UNVERIFIED";

    return { status, matchedFields, mismatchedFields };
  }

  /**
   * Domain 2: EDUCATION Checks
   * Required checks: fullName, dateOfBirth, collegeName
   */
  verifyEducation(
    submitted: CommonDataModel,
    normalized: Partial<CommonDataModel>
  ): {
    status: VerificationStatus;
    matchedFields: FieldComparison[];
    mismatchedFields: FieldComparison[];
  } {
    const checks: FieldComparison[] = [
      this.compareField("fullName", submitted.fullName, normalized.fullName),
      this.compareField("dateOfBirth", submitted.dateOfBirth, normalized.dateOfBirth),
      this.compareField("collegeName", submitted.collegeName, normalized.collegeName)
    ];

    const matchedFields = checks.filter((c) => c.match);
    const mismatchedFields = checks.filter((c) => !c.match);
    const status: VerificationStatus = mismatchedFields.length === 0 ? "VERIFIED" : "UNVERIFIED";

    return { status, matchedFields, mismatchedFields };
  }

  /**
   * Domain 3: INCOME Checks
   * Required checks: fullName, annualIncome, incomeCertificateNumber
   */
  verifyIncome(
    submitted: CommonDataModel,
    normalized: Partial<CommonDataModel>
  ): {
    status: VerificationStatus;
    matchedFields: FieldComparison[];
    mismatchedFields: FieldComparison[];
  } {
    const checks: FieldComparison[] = [
      this.compareField("fullName", submitted.fullName, normalized.fullName),
      this.compareField("annualIncome", submitted.annualIncome, normalized.annualIncome, "number"),
      this.compareField(
        "incomeCertificateNumber",
        submitted.incomeCertificateNumber,
        normalized.incomeCertificateNumber
      )
    ];

    const matchedFields = checks.filter((c) => c.match);
    const mismatchedFields = checks.filter((c) => !c.match);
    const status: VerificationStatus = mismatchedFields.length === 0 ? "VERIFIED" : "UNVERIFIED";

    return { status, matchedFields, mismatchedFields };
  }

  /**
   * Domain 4: DOCUMENTS Checks
   * Required checks: fullName, identity proof (citizenId), income certificate (incomeCertificateNumber)
   */
  verifyDocuments(
    submitted: CommonDataModel,
    normalized: Partial<CommonDataModel>
  ): {
    status: VerificationStatus;
    matchedFields: FieldComparison[];
    mismatchedFields: FieldComparison[];
  } {
    const checks: FieldComparison[] = [
      this.compareField("fullName", submitted.fullName, normalized.fullName),
      this.compareField("identityProofNumber", submitted.citizenId, normalized.citizenId),
      this.compareField(
        "incomeCertificateNumber",
        submitted.incomeCertificateNumber,
        normalized.incomeCertificateNumber
      )
    ];

    const matchedFields = checks.filter((c) => c.match);
    const mismatchedFields = checks.filter((c) => !c.match);
    const status: VerificationStatus = mismatchedFields.length === 0 ? "VERIFIED" : "UNVERIFIED";

    return { status, matchedFields, mismatchedFields };
  }
}

export const matchingService = new MatchingService();
