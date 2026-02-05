"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateNames = getTemplateNames;
exports.loadTemplate = loadTemplate;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const validator_1 = require("./validator");
const TEMPLATE_FILES = {
    "typescript-cli": "typescript-cli.json",
    "nextjs-app": "nextjs-app.json",
    "python-cli": "python-cli.json",
};
const TEMPLATE_DIR_CANDIDATES = [
    node_path_1.default.join(__dirname, "templates"),
    node_path_1.default.join(process.cwd(), "src", "templates"),
];
function resolveTemplatePath(templateName) {
    const templateFile = TEMPLATE_FILES[templateName];
    for (const directory of TEMPLATE_DIR_CANDIDATES) {
        const candidatePath = node_path_1.default.join(directory, templateFile);
        try {
            (0, node_fs_1.readFileSync)(candidatePath, "utf8");
            return candidatePath;
        }
        catch {
            // Try the next candidate path.
        }
    }
    throw new Error(`Template file not found: ${templateFile}`);
}
function getTemplateNames() {
    return Object.keys(TEMPLATE_FILES);
}
function loadTemplate(templateName) {
    if (!(templateName in TEMPLATE_FILES)) {
        throw new Error(`Unknown template: ${templateName}. Available templates: ${getTemplateNames().join(", ")}`);
    }
    const typedName = templateName;
    const templatePath = resolveTemplatePath(typedName);
    const fileContents = (0, node_fs_1.readFileSync)(templatePath, "utf8");
    const parsedTemplate = JSON.parse(fileContents);
    if (!(0, validator_1.isValidPRD)(parsedTemplate)) {
        throw new Error(`Invalid template content for ${templateName}`);
    }
    return parsedTemplate;
}
//# sourceMappingURL=template-loader.js.map