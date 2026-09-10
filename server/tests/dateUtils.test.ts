import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeDateToISO } from "../src/utils/dateUtils.js";

describe("Date Normalization Utility", () => {
  it("converts DD/MM/YYYY to ISO YYYY-MM-DD (Identity System format)", () => {
    const raw = "12/05/2007";
    const result = normalizeDateToISO(raw);
    assert.equal(result, "2007-05-12");
  });

  it("converts DD-MM-YYYY to ISO YYYY-MM-DD (Education System format)", () => {
    const raw = "12-05-2007";
    const result = normalizeDateToISO(raw);
    assert.equal(result, "2007-05-12");
  });

  it("pads single-digit days and months correctly", () => {
    assert.equal(normalizeDateToISO("5/7/2007"), "2007-07-05");
    assert.equal(normalizeDateToISO("1-2-2005"), "2005-02-01");
  });

  it("preserves already normalized ISO YYYY-MM-DD dates", () => {
    const raw = "2007-05-12";
    const result = normalizeDateToISO(raw);
    assert.equal(result, "2007-05-12");
  });

  it("throws error for invalid or unparseable date strings", () => {
    assert.throws(() => normalizeDateToISO("invalid-date"), /Unrecognized date format/);
    assert.throws(() => normalizeDateToISO(""), /Invalid date input/);
    assert.throws(() => normalizeDateToISO("32/05/2007"), /Invalid day in date/);
    assert.throws(() => normalizeDateToISO("12/13/2007"), /Invalid month in date/);
  });
});
