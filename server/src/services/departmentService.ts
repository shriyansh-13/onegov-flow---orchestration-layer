import {
  IdentityRawResponse,
  EducationRawResponse,
  IncomeRawResponse,
  DocumentRawResponse
} from "../models/departmentTypes.js";
import {
  MOCK_IDENTITY_DATABASE,
  MOCK_EDUCATION_DATABASE,
  MOCK_INCOME_DATABASE,
  MOCK_DOCUMENT_DATABASE
} from "../data/mockDepartments.js";

/**
 * SIMULATED DEPARTMENT SERVICE
 * Represents external REST APIs/services of 4 independent government departments.
 * Uses async/await to emulate network requests and real-world system behavior.
 */
export class DepartmentService {
  /**
   * Fetch raw data from Identity Mainframe System
   */
  async fetchIdentityData(citizenId: string): Promise<IdentityRawResponse> {
    // Emulate asynchronous network I/O
    await new Promise((resolve) => setTimeout(resolve, 20));

    const record = MOCK_IDENTITY_DATABASE[citizenId];
    if (!record) {
      throw new Error(`Identity System: No record found for citizen ID ${citizenId}`);
    }
    return JSON.parse(JSON.stringify(record));
  }

  /**
   * Fetch raw data from Education Board System
   */
  async fetchEducationData(citizenId: string): Promise<EducationRawResponse> {
    await new Promise((resolve) => setTimeout(resolve, 20));

    const record = MOCK_EDUCATION_DATABASE[citizenId];
    if (!record) {
      throw new Error(`Education System: No record found for student ID ${citizenId}`);
    }
    return JSON.parse(JSON.stringify(record));
  }

  /**
   * Fetch raw data from Revenue / Income Tax System
   */
  async fetchIncomeData(citizenId: string): Promise<IncomeRawResponse> {
    await new Promise((resolve) => setTimeout(resolve, 20));

    const record = MOCK_INCOME_DATABASE[citizenId];
    if (!record) {
      throw new Error(`Income System: No record found for citizen ID ${citizenId}`);
    }
    return JSON.parse(JSON.stringify(record));
  }

  /**
   * Fetch raw data from National Document Repository
   */
  async fetchDocumentData(citizenId: string): Promise<DocumentRawResponse> {
    await new Promise((resolve) => setTimeout(resolve, 20));

    const record = MOCK_DOCUMENT_DATABASE[citizenId];
    if (!record) {
      throw new Error(`Document System: No record found for person ID ${citizenId}`);
    }
    return JSON.parse(JSON.stringify(record));
  }

  /**
   * Fetch all raw department responses in parallel
   */
  async fetchAllRawDepartmentData(citizenId: string): Promise<{
    identity: IdentityRawResponse;
    education: EducationRawResponse;
    income: IncomeRawResponse;
    document: DocumentRawResponse;
  }> {
    const [identity, education, income, document] = await Promise.all([
      this.fetchIdentityData(citizenId),
      this.fetchEducationData(citizenId),
      this.fetchIncomeData(citizenId),
      this.fetchDocumentData(citizenId)
    ]);

    return {
      identity,
      education,
      income,
      document
    };
  }
}

export const departmentService = new DepartmentService();
