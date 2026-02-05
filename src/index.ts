export function main(): void {
  console.log("PRD Generator CLI");
}

if (require.main === module) {
  main();
}

export type { PRD, PRDItem, TechStack } from "./types";
export { isValidPRD, validatePRD } from "./validator";
export { getTemplateNames, loadTemplate } from "./template-loader";
