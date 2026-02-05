import type { PRD } from "./types";
declare const TEMPLATE_FILES: {
    readonly "typescript-cli": "typescript-cli.json";
    readonly "nextjs-app": "nextjs-app.json";
    readonly "python-cli": "python-cli.json";
};
export type TemplateName = keyof typeof TEMPLATE_FILES;
export declare function getTemplateNames(): TemplateName[];
export declare function loadTemplate(templateName: string): PRD;
export {};
