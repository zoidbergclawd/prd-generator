#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProgram = buildProgram;
const commander_1 = require("commander");
const init_command_1 = require("./init-command");
const validate_command_1 = require("./validate-command");
const { version } = require("../package.json");
function buildProgram() {
    const program = new commander_1.Command();
    program
        .name("prd-gen")
        .description("Generate Ralph-compatible PRDs from project descriptions")
        .version(version)
        .helpOption("-h, --help", "Display help for command");
    program
        .command("init")
        .description("Create a new PRD interactively in the current directory")
        .action(async () => {
        const { outputPath } = await (0, init_command_1.runInit)();
        console.log(`Created ${outputPath}`);
    });
    program
        .command("validate")
        .description("Validate an existing PRD JSON file")
        .argument("<file>", "Path to PRD JSON file")
        .action((file) => {
        try {
            const { errors } = (0, validate_command_1.runValidate)(file);
            if (errors.length === 0) {
                console.log(`PRD is valid: ${file}`);
                return;
            }
            console.error(`PRD validation failed for ${file}:`);
            errors.forEach((error) => {
                console.error(`- ${error}`);
            });
            process.exitCode = 1;
        }
        catch (error) {
            console.error(error.message);
            process.exitCode = 1;
        }
    });
    return program;
}
if (require.main === module) {
    void buildProgram().parseAsync();
}
//# sourceMappingURL=cli.js.map