import { describe, expect, it } from "vitest";

import { getTemplateNames, loadTemplate } from "../src/template-loader";
import { isValidPRD, validatePRD } from "../src/validator";

describe("template loader", () => {
  it("returns all expected template names", () => {
    expect(getTemplateNames()).toEqual([
      "typescript-cli",
      "nextjs-app",
      "python-cli",
    ]);
  });

  it("loads each template and passes validation", () => {
    for (const templateName of getTemplateNames()) {
      const template = loadTemplate(templateName);

      expect(template.project.length).toBeGreaterThan(0);
      expect(template.goal.length).toBeGreaterThan(0);
      expect(isValidPRD(template)).toBe(true);
      expect(validatePRD(template)).toEqual([]);
    }
  });

  it("throws for unknown template names", () => {
    expect(() => loadTemplate("unknown-template")).toThrow(
      "Unknown template: unknown-template"
    );
  });
});
