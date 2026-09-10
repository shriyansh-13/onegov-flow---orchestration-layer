import { CitizenApplication } from "../models/commonDataModel.js";

/**
 * Standard Demo Citizen Application as specified in Section 2
 * Application ID: APP-DEMO-001
 * Citizen ID: CIT-001
 */
export const DEMO_APPLICATION: CitizenApplication = {
  applicationId: "APP-DEMO-001",
  citizenId: "CIT-001",
  fullName: "Aarav Sharma",
  fatherName: "Rajesh Kumar Sharma",
  dateOfBirth: "2007-05-12",
  collegeName: "National Institute of Technology, Delhi",
  annualIncome: 180000,
  incomeCertificateNumber: "INC-MP-2026-001",
  schemeName: "Post-Matric Scholarship",
  submissionDate: "2026-09-01T10:30:00.000Z",
  status: "SUBMITTED"
};
