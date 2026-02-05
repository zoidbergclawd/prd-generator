import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { buildProgram } from "../src/cli";

describe("cli validate command", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;

    for (const dir of tempDirs) {
      rmSync(dir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  it("reports success for a valid PRD file", async () => {
    const cwd = mkdtempSync(path.join(os.tmpdir(), "prd-validate-"));
    tempDirs.push(cwd);

    const filePath = path.join(cwd, "prd.json");
    writeFileSync(
      filePath,
      JSON.stringify(
        {
          project: "PRD Generator",
          goal: "Generate PRDs",
          items: [],
        },
        null,
        2
      )
    );

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    await buildProgram().parseAsync(["validate", filePath], { from: "user" });

    expect(logSpy).toHaveBeenCalledWith(`PRD is valid: ${filePath}`);
    expect(errorSpy).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
  });

  it("reports validation issues and sets exit code 1", async () => {
    const cwd = mkdtempSync(path.join(os.tmpdir(), "prd-validate-"));
    tempDirs.push(cwd);

    const filePath = path.join(cwd, "invalid-prd.json");
    writeFileSync(
      filePath,
      JSON.stringify(
        {
          project: "PRD Generator",
          goal: "Generate PRDs",
          items: [{}],
        },
        null,
        2
      )
    );

    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    await buildProgram().parseAsync(["validate", filePath], { from: "user" });

    expect(errorSpy).toHaveBeenCalledWith(
      `PRD validation failed for ${filePath}:`
    );
    expect(errorSpy).toHaveBeenCalledWith("- Item 0 missing required field: id");
    expect(errorSpy).toHaveBeenCalledWith(
      "- Item 0 missing required field: title"
    );
    expect(errorSpy).toHaveBeenCalledWith(
      "- Item 0 missing required field: verification"
    );
    expect(errorSpy).toHaveBeenCalledWith(
      "- Item 0 missing required field: steps"
    );
    expect(process.exitCode).toBe(1);
  });

  it("reports invalid JSON and sets exit code 1", async () => {
    const cwd = mkdtempSync(path.join(os.tmpdir(), "prd-validate-"));
    tempDirs.push(cwd);

    const filePath = path.join(cwd, "bad-json.json");
    writeFileSync(filePath, "{");

    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    await buildProgram().parseAsync(["validate", filePath], { from: "user" });

    const [message] = errorSpy.mock.calls[0] as [string];
    expect(message).toContain(`Invalid JSON in ${filePath}`);
    expect(process.exitCode).toBe(1);
  });
});
