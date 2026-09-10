import { CitizenApplication } from "../models/commonDataModel.js";
import {
  DomainVerificationResult,
  VerificationSummary,
  DomainType
} from "../models/departmentTypes.js";
import { departmentService, DepartmentService } from "./departmentService.js";
import { matchingService, MatchingService } from "./matchingService.js";
import { summaryService, SummaryService } from "./summaryService.js";
import {
  adaptIdentityData,
  adaptEducationData,
  adaptIncomeData,
  adaptDocumentData
} from "../adapters/index.js";

/**
 * ORCHESTRATOR SERVICE (Section 12)
 * Coordinates the entire pipeline:
 * 1. Load application data
 * 2. Asynchronously query heterogeneous department systems
 * 3. Execute domain-specific adapters to normalize into Common Data Model
 * 4. Execute matching engine to compare citizen vs normalized department data
 * 5. Handle individual department failures gracefully without failing the entire pipeline
 * 6. Generate unified verification summary
 */
export class OrchestratorService {
  constructor(
    private deptService: DepartmentService = departmentService,
    private matcher: MatchingService = matchingService,
    private summarizer: SummaryService = summaryService
  ) {}

  /**
   * Process Domain 1: IDENTITY
   */
  async processIdentityDomain(application: CitizenApplication): Promise<DomainVerificationResult> {
    try {
      const rawData = await this.deptService.fetchIdentityData(application.citizenId);
      const normalizedData = adaptIdentityData(rawData);
      const verification = this.matcher.verifyIdentity(application, normalizedData);

      return {
        domain: "IDENTITY",
        sourceSystem: "IDENTITY_SYSTEM",
        rawData,
        normalizedData,
        verification
      };
    } catch (err: any) {
      return {
        domain: "IDENTITY",
        sourceSystem: "IDENTITY_SYSTEM",
        verification: {
          status: "UNAVAILABLE",
          matchedFields: [],
          mismatchedFields: [],
          error: err?.message || "Identity System unavailable"
        }
      };
    }
  }

  /**
   * Process Domain 2: EDUCATION
   */
  async processEducationDomain(application: CitizenApplication): Promise<DomainVerificationResult> {
    try {
      const rawData = await this.deptService.fetchEducationData(application.citizenId);
      const normalizedData = adaptEducationData(rawData);
      const verification = this.matcher.verifyEducation(application, normalizedData);

      return {
        domain: "EDUCATION",
        sourceSystem: "EDUCATION_SYSTEM",
        rawData,
        normalizedData,
        verification
      };
    } catch (err: any) {
      return {
        domain: "EDUCATION",
        sourceSystem: "EDUCATION_SYSTEM",
        verification: {
          status: "UNAVAILABLE",
          matchedFields: [],
          mismatchedFields: [],
          error: err?.message || "Education System unavailable"
        }
      };
    }
  }

  /**
   * Process Domain 3: INCOME
   */
  async processIncomeDomain(application: CitizenApplication): Promise<DomainVerificationResult> {
    try {
      const rawData = await this.deptService.fetchIncomeData(application.citizenId);
      const normalizedData = adaptIncomeData(rawData);
      const verification = this.matcher.verifyIncome(application, normalizedData);

      return {
        domain: "INCOME",
        sourceSystem: "INCOME_SYSTEM",
        rawData,
        normalizedData,
        verification
      };
    } catch (err: any) {
      return {
        domain: "INCOME",
        sourceSystem: "INCOME_SYSTEM",
        verification: {
          status: "UNAVAILABLE",
          matchedFields: [],
          mismatchedFields: [],
          error: err?.message || "Income System unavailable"
        }
      };
    }
  }

  /**
   * Process Domain 4: DOCUMENTS
   */
  async processDocumentDomain(application: CitizenApplication): Promise<DomainVerificationResult> {
    try {
      const rawData = await this.deptService.fetchDocumentData(application.citizenId);
      const normalizedData = adaptDocumentData(rawData);
      const verification = this.matcher.verifyDocuments(application, normalizedData);

      return {
        domain: "DOCUMENTS",
        sourceSystem: "DOCUMENT_SYSTEM",
        rawData,
        normalizedData,
        verification
      };
    } catch (err: any) {
      return {
        domain: "DOCUMENTS",
        sourceSystem: "DOCUMENT_SYSTEM",
        verification: {
          status: "UNAVAILABLE",
          matchedFields: [],
          mismatchedFields: [],
          error: err?.message || "Document System unavailable"
        }
      };
    }
  }

  /**
   * Run the full multi-department pipeline
   */
  async verifyApplication(application: CitizenApplication): Promise<VerificationSummary> {
    // Execute all 4 domains concurrently; individual errors are isolated inside their methods
    const [identityResult, educationResult, incomeResult, documentResult] = await Promise.all([
      this.processIdentityDomain(application),
      this.processEducationDomain(application),
      this.processIncomeDomain(application),
      this.processDocumentDomain(application)
    ]);

    const domainResults: DomainVerificationResult[] = [
      identityResult,
      educationResult,
      incomeResult,
      documentResult
    ];

    return this.summarizer.compileSummary(application.applicationId, domainResults);
  }
}

export const orchestratorService = new OrchestratorService();
