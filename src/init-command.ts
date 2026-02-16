import { writeFileSync } from "node:fs";
import path from "node:path";
import inquirer from "inquirer";

import { getTemplateNames, loadTemplate } from "./template-loader";
import type { PRD, TechStack } from "./types";
import { validatePRD } from "./validator";

type PromptResponse = {
  templateName: string;
  projectName: string;
  goal: string;
  techStack: string;
  targetUser: string;
};

type PromptFn = (questions: unknown[]) => Promise<PromptResponse>;

interface InitDeps {
  prompt: PromptFn;
  getTemplateNames: typeof getTemplateNames;
  loadTemplate: typeof loadTemplate;
  writeFile: typeof writeFileSync;
}

interface InitOptions {
  cwd?: string;
  outputFileName?: string;
}

export interface InitResult {
  outputPath: string;
  prd: PRD;
}

const BLANK_TEMPLATE = "blank";

function parseTechStack(input: string, fallback?: TechStack): TechStack {
  const [language, framework, testing] = input
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return {
    language: language ?? fallback?.language ?? "Unknown",
    framework: framework ?? fallback?.framework ?? "Unknown",
    testing: testing ?? fallback?.testing ?? "Unknown",
  };
}

function buildPrdFromAnswers(answers: PromptResponse, deps: InitDeps): PRD {
  const basePrd =
    answers.templateName === BLANK_TEMPLATE
      ? {
          project: "",
          goal: "",
          tech_stack: {
            language: "Unknown",
            framework: "Unknown",
            testing: "Unknown",
          },
          context: {
            target_user: "",
            constraints: "None specified",
          },
          items: [],
        }
      : deps.loadTemplate(answers.templateName);

  return {
    ...basePrd,
    project: answers.projectName.trim(),
    goal: answers.goal.trim(),
    tech_stack: parseTechStack(answers.techStack, basePrd.tech_stack),
    context: {
      ...basePrd.context,
      target_user: answers.targetUser.trim(),
      constraints: basePrd.context.constraints || "None specified",
    },
  };
}

export async function runInit(
  options: InitOptions = {},
  partialDeps: Partial<InitDeps> = {}
): Promise<InitResult> {
  const deps: InitDeps = {
    prompt: (questions) => inquirer.prompt(questions) as Promise<PromptResponse>,
    getTemplateNames,
    loadTemplate,
    writeFile: writeFileSync,
    ...partialDeps,
  };

  const answers = await deps.prompt([
    {
      type: "list",
      name: "templateName",
      message: "Start from a template?",
      choices: [
        { name: "Blank PRD", value: BLANK_TEMPLATE },
        ...deps.getTemplateNames().map((name) => ({ name, value: name })),
      ],
    },
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      validate: (value: string) =>
        value.trim().length > 0 ? true : "Project name is required",
    },
    {
      type: "input",
      name: "goal",
      message: "Project goal:",
      validate: (value: string) =>
        value.trim().length > 0 ? true : "Goal is required",
    },
    {
      type: "input",
      name: "techStack",
      message: "Tech stack (language, framework, testing):",
      validate: (value: string) =>
        value.trim().length > 0 ? true : "Tech stack is required",
    },
    {
      type: "input",
      name: "targetUser",
      message: "Target user:",
      validate: (value: string) =>
        value.trim().length > 0 ? true : "Target user is required",
    },
  ]);

  const prd = buildPrdFromAnswers(answers, deps);
  const validationErrors = validatePRD(prd);

  if (validationErrors.length > 0) {
    throw new Error(
      `Generated PRD failed validation: ${validationErrors.join("; ")}`
    );
  }

  const outputPath = path.join(options.cwd ?? process.cwd(), options.outputFileName ?? "prd.json");
  deps.writeFile(outputPath, `${JSON.stringify(prd, null, 2)}\n`, "utf8");

  return { outputPath, prd };
}
