import { readFileSync, writeFileSync } from "node:fs";
import type { PRD, PRDItem } from "./types";
type PromptResponse = {
    category: string;
    title: string;
    description: string;
    priority: string;
    verification: string;
    steps: string;
    notes: string;
};
type PromptFn = (questions: unknown[]) => Promise<PromptResponse>;
interface AddItemDeps {
    prompt: PromptFn;
    readFile: typeof readFileSync;
    writeFile: typeof writeFileSync;
}
interface AddItemOptions {
    cwd?: string;
    fileName?: string;
}
export interface AddItemResult {
    outputPath: string;
    prd: PRD;
    item: PRDItem;
}
export declare function runAddItem(options?: AddItemOptions, partialDeps?: Partial<AddItemDeps>): Promise<AddItemResult>;
export {};
