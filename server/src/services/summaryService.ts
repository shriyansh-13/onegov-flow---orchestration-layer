import {
  DomainVerificationResult,
  VerificationSummary
} from "../models/departmentTypes.js";

/**
 * VERIFICATION SUMMARY SERVICE (Section 10)
 * Aggregates verification results across all domains.
 * Crucially, summary counts are calculated dynamically from actual domain evaluations,
 * never hard-coded.
 */
export class SummaryService {
  compileSummary(
    applicationId: string,
    domainResults: DomainVerificationResult[]
  ): VerificationSummary {
    const required = domainResults.length;
    let verified = 0;
    let unverified = 0;
    let unavailable = 0;

    const domainsSummary = domainResults.map((res) => {
      if (res.verification.status === "VERIFIED") {
        verified++;
      } else if (res.verification.status === "UNAVAILABLE") {
        unavailable++;
      } else {
        unverified++;
      }

      return {
        domain: res.domain,
        status: res.verification.status
      };
    });

    let status: "VERIFICATION_COMPLETE" | "VERIFICATION_INCOMPLETE" | "VERIFICATION_FAILED" =
      "VERIFICATION_INCOMPLETE";

    if (verified === required && required > 0) {
      status = "VERIFICATION_COMPLETE";
    } else if (unverified > 0 || unavailable > 0) {
      status = "VERIFICATION_INCOMPLETE";
    }

    return {
      applicationId,
      summary: {
        required,
        verified,
        unverified,
        unavailable,
        status
      },
      domains: domainsSummary,
      domainResults,
      timestamp: new Date().toISOString()
    };
  }
}

export const summaryService = new SummaryService();
