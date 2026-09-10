import { CommonDataModel } from "./commonDataModel.js";

/**
 * DEPARTMENT 1 — IDENTITY SYSTEM
 * Legacy mainframe schema: UPPERCASE keys, DD/MM/YYYY date format.
 */
export interface IdentityRawResponse {
  CITIZEN_ID: string;
  FULL_NAME: string;
  FATHER_NAME: string;
  DOB: string; // e.g. "12/05/2007" (DD/MM/YYYY)
}

/**
 * DEPARTMENT 2 — EDUCATION SYSTEM
 * Academic portal schema: camelCase keys, DD-MM-YYYY date format.
 */
export interface EducationRawResponse {
  studentId: string;
  studentName: string;
  birthDate: string; // e.g. "12-05-2007" (DD-MM-YYYY)
  institution: string;
}

/**
 * DEPARTMENT 3 — INCOME SYSTEM
 * Revenue / Tax registry schema: snake_case keys, numeric income, boolean validity flag.
 */
export interface IncomeRawResponse {
  citizen_id: string;
  applicant_name: string;
  annual_income: number;
  income_certificate_no: string;
  is_valid: boolean;
}

/**
 * DEPARTMENT 4 — DOCUMENT SYSTEM
 * Document repository: Deeply nested person object and documents array with status codes.
 */
export interface DocumentItem {
  type: "INCOME_CERTIFICATE" | "IDENTITY_PROOF" | string;
  number: string;
  statusCode: "DOC_VALID" | "DOC_INVALID" | string;
}

export interface DocumentRawResponse {
  person: {
    name: string;
  };
  documents: DocumentItem[];
}

/**
 * VERIFICATION & COMPARISON TYPES
 */
export interface FieldComparison {
  field: string;
  submitted: any;
  department: any;
  match: boolean;
  remarks?: string;
}

export type DomainType = "IDENTITY" | "EDUCATION" | "INCOME" | "DOCUMENTS";
export type VerificationStatus = "VERIFIED" | "UNVERIFIED" | "UNAVAILABLE";

export interface DomainVerificationResult {
  domain: DomainType;
  sourceSystem: string;
  rawData?: any;
  normalizedData?: Partial<CommonDataModel>;
  verification: {
    status: VerificationStatus;
    matchedFields: FieldComparison[];
    mismatchedFields: FieldComparison[];
    error?: string;
  };
}

export interface VerificationSummary {
  applicationId: string;
  summary: {
    required: number;
    verified: number;
    unverified: number;
    unavailable: number;
    status: "VERIFICATION_COMPLETE" | "VERIFICATION_INCOMPLETE" | "VERIFICATION_FAILED";
  };
  domains: {
    domain: DomainType;
    status: VerificationStatus;
  }[];
  domainResults: DomainVerificationResult[];
  timestamp: string;
}
