import { IdentityRawResponse } from "../models/departmentTypes.js";
import { CommonDataModel } from "../models/commonDataModel.js";
import { normalizeDateToISO } from "../utils/dateUtils.js";

/**
 * IDENTITY ADAPTER
 * Transforms legacy mainframe schema (UPPERCASE keys, DD/MM/YYYY dates)
 * into normalized Common Data Model.
 */
export function adaptIdentityData(raw: IdentityRawResponse): Partial<CommonDataModel> {
  if (!raw) {
    throw new Error("Identity raw data is required for adaptation");
  }

  if (!raw.CITIZEN_ID || !raw.FULL_NAME) {
    throw new Error("Identity raw data missing mandatory fields (CITIZEN_ID or FULL_NAME)");
  }

  return {
    citizenId: raw.CITIZEN_ID.trim(),
    fullName: raw.FULL_NAME.trim(),
    fatherName: raw.FATHER_NAME ? raw.FATHER_NAME.trim() : undefined,
    dateOfBirth: normalizeDateToISO(raw.DOB)
  };
}
