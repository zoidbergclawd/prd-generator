import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import inquirer from "inquirer";

import type { PRD, PRDItem } from "./types";
import { validatePRD } from "./validator";

type PromptResponse = {
  category: string;
  title: string;
  description: string;
  priority: string;
  verification: string;
  steps: string;
  notes: string;
};

type PromptFn = (questions: unknown[]) => Promise<PromptResponse>;

interface AddItemDeps {
  prompt: PromptFn;
  readFile: typeof readFileSync;
  writeFile: typeof writeFileSync;
}

interface AddItemOptions {
  cwd?: string;
  fileName?: string;
}

export interface AddItemResult {
  outputPath: string;
  prd: PRD;
  item: PRDItem;
}

function parseSteps(input: string): string[] {
  return input
    .split(",")
    .map((step) => step.trim())
    .filter((step) => step.length > 0);
}

function parsePriority(input: string): number {
  const parsed = Number.parseInt(input, 10);
  return Number.isNaN(parsed) ? 1 : parsed;
}

function getNextItemId(prd: PRD): number {
  const maxId = prd.items.reduce((currentMax, item) => {
    if (typeof item.id !== "number" || Number.isNaN(item.id)) {
      return currentMax;
    }

    return Math.max(currentMax, item.id);
  }, 0);

  return maxId + 1;
}

export async function runAddItem(
  options: AddItemOptions = {},
  partialDeps: Partial<AddItemDeps> = {}
): Promise<AddItemResult> {
  const deps: AddItemDeps = {
    prompt: (questions) => inquirer.prompt(questions) as Promise<PromptResponse>,
    readFile: readFileSync,
    writeFile: writeFileSync,
    ...partialDeps,
  };

  const outputPath = path.join(options.cwd ?? process.cwd(), options.fileName ?? "prd.json");

  let parsed: unknown;

  try {
    const contents = deps.readFile(outputPath, "utf8");
    parsed = JSON.parse(contents) as unknown;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${outputPath}: ${error.message}`);
    }

    throw new Error(`Failed to read ${outputPath}: ${(error as Error).message}`);
  }

  const validationErrors = validatePRD(parsed);
  if (validationErrors.length > 0) {
    throw new Error(
      `Cannot add item because ${outputPath} is invalid: ${validationErrors.join("; ")}`
    );
  }

  const prd = parsed as PRD;

  const answers = await deps.prompt([
    {
      type: "input",
      name: "category",
      message: "Item category:",
      validate: (value: string) =>
        value.trim().length > 0 ? true : "Category is required",
    },
    {
      type: "input",
      name: "title",
      message: "Item title:",
      validate: (value: string) =>
        value.trim().length > 0 ? true : "Title is required",
    },
    {
      type: "input",
      name: "description",
      message: "Item description:",
      validate: (value: string) =>
        value.trim().length > 0 ? true : "Description is required",
    },
    {
      type: "input",
      name: "priority",
      message: "Priority (number):",
      default: "2",
      validate: (value: string) => {
        const parsedPriority = Number.parseInt(value, 10);
        return Number.isInteger(parsedPriority) && parsedPriority > 0
          ? true
          : "Priority must be a positive integer";
      },
    },
    {
      type: "input",
      name: "verification",
      message: "Verification:",
      validate: (value: string) =>
        value.trim().length > 0 ? true : "Verification is required",
    },
    {
      type: "input",
      name: "steps",
      message: "Steps (comma-separated):",
      validate: (value: string) =>
        parseSteps(value).length > 0 ? true : "At least one step is required",
    },
    {
      type: "input",
      name: "notes",
      message: "Notes (optional):",
    },
  ]);

  const nextId = getNextItemId(prd);

  const item: PRDItem = {
    id: nextId,
    category: answers.category.trim(),
    title: answers.title.trim(),
    description: answers.description.trim(),
    priority: parsePriority(answers.priority),
    passes: false,
    verification: answers.verification.trim(),
    steps: parseSteps(answers.steps),
  };

  const notes = answers.notes.trim();
  if (notes.length > 0) {
    item.notes = notes;
  }

  const nextPrd: PRD = {
    ...prd,
    items: [...prd.items, item],
  };

  deps.writeFile(outputPath, `${JSON.stringify(nextPrd, null, 2)}\n`, "utf8");

  return {
    outputPath,
    prd: nextPrd,
    item,
  };
}
