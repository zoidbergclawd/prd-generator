#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const { version } = require("../package.json");
const program = new commander_1.Command();
program
    .name("prd-gen")
    .description("Generate Ralph-compatible PRDs from project descriptions")
    .version(version)
    .helpOption("-h, --help", "Display help for command");
program.parse();
//# sourceMappingURL=cli.js.map