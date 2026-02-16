import { readFileSync } from "node:fs";
import path from "node:path";

import { validatePRD } from "./validator";

export interface ValidateResult {
  filePath: string;
  errors: string[];
}

export function runValidate(file: string, cwd: string = process.cwd()): ValidateResult {
  const filePath = path.resolve(cwd, file);
  let parsed: unknown;

  try {
    const contents = readFileSync(filePath, "utf8");
    parsed = JSON.parse(contents) as unknown;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${file}: ${error.message}`);
    }
    throw new Error(`Failed to read ${file}: ${(error as Error).message}`);
  }

  return {
    filePath,
    errors: validatePRD(parsed),
  };
}
