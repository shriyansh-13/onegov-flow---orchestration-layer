import { DocumentRawResponse } from "../models/departmentTypes.js";
import { CommonDataModel } from "../models/commonDataModel.js";

/**
 * DOCUMENT ADAPTER
 * Transforms nested document repository schema (person object and documents array)
 * into normalized Common Data Model.
 */
export function adaptDocumentData(raw: DocumentRawResponse): Partial<CommonDataModel> & {
  documentStatuses?: Record<string, string>;
} {
  if (!raw) {
    throw new Error("Document raw data is required for adaptation");
  }

  if (!raw.person || !raw.person.name) {
    throw new Error("Document raw data missing mandatory person name");
  }

  if (!Array.isArray(raw.documents)) {
    throw new Error("Document raw data missing valid documents array");
  }

  const normalized: Partial<CommonDataModel> & { documentStatuses?: Record<string, string> } = {
    fullName: raw.person.name.trim(),
    documentStatuses: {}
  };

  for (const doc of raw.documents) {
    if (normalized.documentStatuses) {
      normalized.documentStatuses[doc.type] = doc.statusCode;
    }

    if (doc.type === "IDENTITY_PROOF" && doc.statusCode === "DOC_VALID") {
      normalized.citizenId = doc.number.trim();
    } else if (doc.type === "INCOME_CERTIFICATE" && doc.statusCode === "DOC_VALID") {
      normalized.incomeCertificateNumber = doc.number.trim();
    }
  }

  return normalized;
}
