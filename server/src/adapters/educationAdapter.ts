import { EducationRawResponse } from "../models/departmentTypes.js";
import { CommonDataModel } from "../models/commonDataModel.js";
import { normalizeDateToISO } from "../utils/dateUtils.js";

/**
 * EDUCATION ADAPTER
 * Transforms academic portal schema (camelCase keys, DD-MM-YYYY dates)
 * into normalized Common Data Model.
 */
export function adaptEducationData(raw: EducationRawResponse): Partial<CommonDataModel> {
  if (!raw) {
    throw new Error("Education raw data is required for adaptation");
  }

  if (!raw.studentId || !raw.studentName) {
    throw new Error("Education raw data missing mandatory fields (studentId or studentName)");
  }

  return {
    citizenId: raw.studentId.trim(),
    fullName: raw.studentName.trim(),
    dateOfBirth: normalizeDateToISO(raw.birthDate),
    collegeName: raw.institution ? raw.institution.trim() : undefined
  };
}
