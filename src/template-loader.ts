import { readFileSync } from "node:fs";
import path from "node:path";

import type { PRD } from "./types";
import { isValidPRD } from "./validator";

const TEMPLATE_FILES = {
  "typescript-cli": "typescript-cli.json",
  "nextjs-app": "nextjs-app.json",
  "python-cli": "python-cli.json",
} as const;

export type TemplateName = keyof typeof TEMPLATE_FILES;

const TEMPLATE_DIR_CANDIDATES = [
  path.join(__dirname, "templates"),
  path.join(process.cwd(), "src", "templates"),
];

function resolveTemplatePath(templateName: TemplateName): string {
  const templateFile = TEMPLATE_FILES[templateName];

  for (const directory of TEMPLATE_DIR_CANDIDATES) {
    const candidatePath = path.join(directory, templateFile);

    try {
      readFileSync(candidatePath, "utf8");
      return candidatePath;
    } catch {
      // Try the next candidate path.
    }
  }

  throw new Error(`Template file not found: ${templateFile}`);
}

export function getTemplateNames(): TemplateName[] {
  return Object.keys(TEMPLATE_FILES) as TemplateName[];
}

export function loadTemplate(templateName: string): PRD {
  if (!(templateName in TEMPLATE_FILES)) {
    throw new Error(
      `Unknown template: ${templateName}. Available templates: ${getTemplateNames().join(", ")}`
    );
  }

  const typedName = templateName as TemplateName;
  const templatePath = resolveTemplatePath(typedName);
  const fileContents = readFileSync(templatePath, "utf8");
  const parsedTemplate = JSON.parse(fileContents) as unknown;

  if (!isValidPRD(parsedTemplate)) {
    throw new Error(`Invalid template content for ${templateName}`);
  }

  return parsedTemplate;
}
