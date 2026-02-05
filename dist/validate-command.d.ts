export interface ValidateResult {
    filePath: string;
    errors: string[];
}
export declare function runValidate(file: string, cwd?: string): ValidateResult;
