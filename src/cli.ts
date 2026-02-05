#!/usr/bin/env node

import { Command } from "commander";
import { runInit } from "./init-command";
import { runValidate } from "./validate-command";

const { version } = require("../package.json") as { version: string };

export function buildProgram(): Command {
  const program = new Command();

  program
    .name("prd-gen")
    .description("Generate Ralph-compatible PRDs from project descriptions")
    .version(version)
    .helpOption("-h, --help", "Display help for command");

  program
    .command("init")
    .description("Create a new PRD interactively in the current directory")
    .action(async () => {
      const { outputPath } = await runInit();
      console.log(`Created ${outputPath}`);
    });

  program
    .command("validate")
    .description("Validate an existing PRD JSON file")
    .argument("<file>", "Path to PRD JSON file")
    .action((file: string) => {
      try {
        const { errors } = runValidate(file);

        if (errors.length === 0) {
          console.log(`PRD is valid: ${file}`);
          return;
        }

        console.error(`PRD validation failed for ${file}:`);
        errors.forEach((error) => {
          console.error(`- ${error}`);
        });
        process.exitCode = 1;
      } catch (error) {
        console.error((error as Error).message);
        process.exitCode = 1;
      }
    });

  return program;
}

if (require.main === module) {
  void buildProgram().parseAsync();
}
