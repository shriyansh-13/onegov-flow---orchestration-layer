import { IncomeRawResponse } from "../models/departmentTypes.js";
import { CommonDataModel } from "../models/commonDataModel.js";

/**
 * INCOME ADAPTER
 * Transforms revenue / tax registry schema (snake_case keys, numeric income)
 * into normalized Common Data Model.
 */
export function adaptIncomeData(raw: IncomeRawResponse): Partial<CommonDataModel> & { isValidRecord?: boolean } {
  if (!raw) {
    throw new Error("Income raw data is required for adaptation");
  }

  if (!raw.citizen_id || !raw.applicant_name) {
    throw new Error("Income raw data missing mandatory fields (citizen_id or applicant_name)");
  }

  const income = typeof raw.annual_income === "number" ? raw.annual_income : Number(raw.annual_income);
  if (isNaN(income)) {
    throw new Error(`Invalid annual_income value: ${raw.annual_income}`);
  }

  return {
    citizenId: raw.citizen_id.trim(),
    fullName: raw.applicant_name.trim(),
    annualIncome: income,
    incomeCertificateNumber: raw.income_certificate_no ? raw.income_certificate_no.trim() : undefined,
    isValidRecord: Boolean(raw.is_valid)
  };
}
