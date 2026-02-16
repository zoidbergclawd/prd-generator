"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAddItem = runAddItem;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const inquirer_1 = __importDefault(require("inquirer"));
const validator_1 = require("./validator");
function parseSteps(input) {
    return input
        .split(",")
        .map((step) => step.trim())
        .filter((step) => step.length > 0);
}
function parsePriority(input) {
    const parsed = Number.parseInt(input, 10);
    return Number.isNaN(parsed) ? 1 : parsed;
}
function getNextItemId(prd) {
    const maxId = prd.items.reduce((currentMax, item) => {
        if (typeof item.id !== "number" || Number.isNaN(item.id)) {
            return currentMax;
        }
        return Math.max(currentMax, item.id);
    }, 0);
    return maxId + 1;
}
async function runAddItem(options = {}, partialDeps = {}) {
    const deps = {
        prompt: (questions) => inquirer_1.default.prompt(questions),
        readFile: node_fs_1.readFileSync,
        writeFile: node_fs_1.writeFileSync,
        ...partialDeps,
    };
    const outputPath = node_path_1.default.join(options.cwd ?? process.cwd(), options.fileName ?? "prd.json");
    let parsed;
    try {
        const contents = deps.readFile(outputPath, "utf8");
        parsed = JSON.parse(contents);
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in ${outputPath}: ${error.message}`);
        }
        throw new Error(`Failed to read ${outputPath}: ${error.message}`);
    }
    const validationErrors = (0, validator_1.validatePRD)(parsed);
    if (validationErrors.length > 0) {
        throw new Error(`Cannot add item because ${outputPath} is invalid: ${validationErrors.join("; ")}`);
    }
    const prd = parsed;
    const answers = await deps.prompt([
        {
            type: "input",
            name: "category",
            message: "Item category:",
            validate: (value) => value.trim().length > 0 ? true : "Category is required",
        },
        {
            type: "input",
            name: "title",
            message: "Item title:",
            validate: (value) => value.trim().length > 0 ? true : "Title is required",
        },
        {
            type: "input",
            name: "description",
            message: "Item description:",
            validate: (value) => value.trim().length > 0 ? true : "Description is required",
        },
        {
            type: "input",
            name: "priority",
            message: "Priority (number):",
            default: "2",
            validate: (value) => {
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
            validate: (value) => value.trim().length > 0 ? true : "Verification is required",
        },
        {
            type: "input",
            name: "steps",
            message: "Steps (comma-separated):",
            validate: (value) => parseSteps(value).length > 0 ? true : "At least one step is required",
        },
        {
            type: "input",
            name: "notes",
            message: "Notes (optional):",
        },
    ]);
    const nextId = getNextItemId(prd);
    const item = {
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
    const nextPrd = {
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
//# sourceMappingURL=add-item-command.js.map