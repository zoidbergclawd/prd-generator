"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInit = runInit;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const inquirer_1 = __importDefault(require("inquirer"));
const template_loader_1 = require("./template-loader");
const validator_1 = require("./validator");
const BLANK_TEMPLATE = "blank";
function parseTechStack(input, fallback) {
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
function buildPrdFromAnswers(answers, deps) {
    const basePrd = answers.templateName === BLANK_TEMPLATE
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
async function runInit(options = {}, partialDeps = {}) {
    const deps = {
        prompt: (questions) => inquirer_1.default.prompt(questions),
        getTemplateNames: template_loader_1.getTemplateNames,
        loadTemplate: template_loader_1.loadTemplate,
        writeFile: node_fs_1.writeFileSync,
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
            validate: (value) => value.trim().length > 0 ? true : "Project name is required",
        },
        {
            type: "input",
            name: "goal",
            message: "Project goal:",
            validate: (value) => value.trim().length > 0 ? true : "Goal is required",
        },
        {
            type: "input",
            name: "techStack",
            message: "Tech stack (language, framework, testing):",
            validate: (value) => value.trim().length > 0 ? true : "Tech stack is required",
        },
        {
            type: "input",
            name: "targetUser",
            message: "Target user:",
            validate: (value) => value.trim().length > 0 ? true : "Target user is required",
        },
    ]);
    const prd = buildPrdFromAnswers(answers, deps);
    const validationErrors = (0, validator_1.validatePRD)(prd);
    if (validationErrors.length > 0) {
        throw new Error(`Generated PRD failed validation: ${validationErrors.join("; ")}`);
    }
    const outputPath = node_path_1.default.join(options.cwd ?? process.cwd(), options.outputFileName ?? "prd.json");
    deps.writeFile(outputPath, `${JSON.stringify(prd, null, 2)}\n`, "utf8");
    return { outputPath, prd };
}
//# sourceMappingURL=init-command.js.map