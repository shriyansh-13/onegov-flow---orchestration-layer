import {
  IdentityRawResponse,
  EducationRawResponse,
  IncomeRawResponse,
  DocumentRawResponse
} from "../models/departmentTypes.js";

/**
 * SIMULATED DEPARTMENT SYSTEMS — RAW RESPONSES (Section 6)
 * Demonstrates deliberate schema heterogeneity across government departments.
 */

export const MOCK_IDENTITY_DATABASE: Record<string, IdentityRawResponse> = {
  "CIT-001": {
    CITIZEN_ID: "CIT-001",
    FULL_NAME: "Aarav Sharma",
    FATHER_NAME: "Rajesh Kumar Sharma",
    DOB: "12/05/2007" // DD/MM/YYYY
  }
};

export const MOCK_EDUCATION_DATABASE: Record<string, EducationRawResponse> = {
  "CIT-001": {
    studentId: "CIT-001",
    studentName: "Aarav Sharma",
    birthDate: "12-05-2007", // DD-MM-YYYY
    institution: "National Institute of Technology, Delhi"
  }
};

export const MOCK_INCOME_DATABASE: Record<string, IncomeRawResponse> = {
  "CIT-001": {
    citizen_id: "CIT-001",
    applicant_name: "Aarav Sharma",
    annual_income: 180000,
    income_certificate_no: "INC-MP-2026-001",
    is_valid: true
  }
};

export const MOCK_DOCUMENT_DATABASE: Record<string, DocumentRawResponse> = {
  "CIT-001": {
    person: {
      name: "Aarav Sharma"
    },
    documents: [
      {
        type: "INCOME_CERTIFICATE",
        number: "INC-MP-2026-001",
        statusCode: "DOC_VALID"
      },
      {
        type: "IDENTITY_PROOF",
        number: "CIT-001",
        statusCode: "DOC_VALID"
      }
    ]
  }
};
