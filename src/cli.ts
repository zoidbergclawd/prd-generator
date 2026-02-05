#!/usr/bin/env node

import { Command } from "commander";

const { version } = require("../package.json") as { version: string };

const program = new Command();

program
  .name("prd-gen")
  .description("Generate Ralph-compatible PRDs from project descriptions")
  .version(version)
  .helpOption("-h, --help", "Display help for command");

program.parse();
