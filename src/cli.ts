#!/usr/bin/env node

import { Command } from "commander";
import { runInit } from "./init-command";

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

  return program;
}

if (require.main === module) {
  void buildProgram().parseAsync();
}
