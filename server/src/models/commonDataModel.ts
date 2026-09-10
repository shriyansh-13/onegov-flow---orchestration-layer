/**
 * OneGov Flow — Common Data Model (CDM)
 * Independent, normalized representation of citizen and scholarship application data.
 * 
 * Architectural rule: The Common Data Model must remain completely independent
 * from any single department's proprietary schema, naming convention, or date format.
 */

export interface CommonDataModel {
  citizenId: string;
  applicationId: string;
  fullName: string;
  fatherName?: string;
  dateOfBirth: string; // Standardized ISO 8601 format: YYYY-MM-DD
  collegeName?: string;
  annualIncome?: number;
  incomeCertificateNumber?: string;
}

export interface CitizenApplication extends CommonDataModel {
  schemeName: string;
  submissionDate: string;
  status: "SUBMITTED" | "UNDER_VERIFICATION" | "VERIFIED" | "REJECTED";
}
