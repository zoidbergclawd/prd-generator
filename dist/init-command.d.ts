import { writeFileSync } from "node:fs";
import { getTemplateNames, loadTemplate } from "./template-loader";
import type { PRD } from "./types";
type PromptResponse = {
    templateName: string;
    projectName: string;
    goal: string;
    techStack: string;
    targetUser: string;
};
type PromptFn = (questions: unknown[]) => Promise<PromptResponse>;
interface InitDeps {
    prompt: PromptFn;
    getTemplateNames: typeof getTemplateNames;
    loadTemplate: typeof loadTemplate;
    writeFile: typeof writeFileSync;
}
interface InitOptions {
    cwd?: string;
    outputFileName?: string;
}
export interface InitResult {
    outputPath: string;
    prd: PRD;
}
export declare function runInit(options?: InitOptions, partialDeps?: Partial<InitDeps>): Promise<InitResult>;
export {};
