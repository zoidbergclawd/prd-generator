"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runValidate = runValidate;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const validator_1 = require("./validator");
function runValidate(file, cwd = process.cwd()) {
    const filePath = node_path_1.default.resolve(cwd, file);
    let parsed;
    try {
        const contents = (0, node_fs_1.readFileSync)(filePath, "utf8");
        parsed = JSON.parse(contents);
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in ${file}: ${error.message}`);
        }
        throw new Error(`Failed to read ${file}: ${error.message}`);
    }
    return {
        filePath,
        errors: (0, validator_1.validatePRD)(parsed),
    };
}
//# sourceMappingURL=validate-command.js.map