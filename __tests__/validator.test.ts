import { describe, expect, it } from "vitest";

import { isValidPRD, validatePRD } from "../src/validator";

describe("PRD validator", () => {
  it("returns no errors for a valid PRD", () => {
    const prd = {
      project: "PRD Generator",
      goal: "Generate Ralph-compatible PRDs",
      items: [
        {
          id: 1,
          title: "Add validator",
          verification: "Validator catches invalid PRDs in tests",
          steps: ["Create validator", "Add tests"],
        },
      ],
    };

    expect(validatePRD(prd)).toEqual([]);
    expect(isValidPRD(prd)).toBe(true);
  });

  it("reports missing required root fields", () => {
    const errors = validatePRD({});

    expect(errors).toContain("Missing required field: project");
    expect(errors).toContain("Missing required field: goal");
    expect(errors).toContain("Missing required field: items");
  });

  it("reports a non-array items value", () => {
    const errors = validatePRD({
      project: "PRD Generator",
      goal: "Generate Ralph-compatible PRDs",
      items: "not-an-array",
    });

    expect(errors).toEqual(["Missing required field: items"]);
  });

  it("reports invalid item structure for required fields", () => {
    const errors = validatePRD({
      project: "PRD Generator",
      goal: "Generate Ralph-compatible PRDs",
      items: [{}],
    });

    expect(errors).toContain("Item 0 missing required field: id");
    expect(errors).toContain("Item 0 missing required field: title");
    expect(errors).toContain("Item 0 missing required field: verification");
    expect(errors).toContain("Item 0 missing required field: steps");
  });

  it("reports non-object items", () => {
    const errors = validatePRD({
      project: "PRD Generator",
      goal: "Generate Ralph-compatible PRDs",
      items: [null, "bad-item"],
    });

    expect(errors).toContain("Item 0 must be an object");
    expect(errors).toContain("Item 1 must be an object");
  });

  it("returns false from isValidPRD for invalid content", () => {
    expect(isValidPRD({ project: "Only project" })).toBe(false);
  });
});
