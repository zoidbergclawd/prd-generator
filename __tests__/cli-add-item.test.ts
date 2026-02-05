import { mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import inquirer from "inquirer";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { buildProgram } from "../src/cli";
import type { PRD } from "../src/types";

describe("cli add-item command", () => {
  const tempDirs: string[] = [];
  const originalCwd = process.cwd();

  afterEach(() => {
    vi.restoreAllMocks();
    process.exitCode = undefined;
    process.chdir(originalCwd);

    for (const dir of tempDirs) {
      rmSync(dir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  it("appends a new item to prd.json", async () => {
    const cwd = mkdtempSync(path.join(os.tmpdir(), "prd-cli-add-item-"));
    tempDirs.push(cwd);

    const filePath = path.join(cwd, "prd.json");
    writeFileSync(
      filePath,
      JSON.stringify(
        {
          project: "PRD Generator",
          goal: "Generate PRDs",
          items: [
            {
              id: 1,
              title: "Existing",
              verification: "ok",
              steps: ["existing step"],
            },
          ],
        },
        null,
        2
      )
    );

    vi.spyOn(inquirer, "prompt").mockResolvedValue({
      category: "cli",
      title: "Add item",
      description: "Adds item",
      priority: "2",
      verification: "prd-gen add-item appends to prd.json",
      steps: "step one, step two",
      notes: "",
    } as never);

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    process.chdir(cwd);
    await buildProgram().parseAsync(["add-item"], { from: "user" });

    const parsed = JSON.parse(readFileSync(filePath, "utf8")) as PRD;

    expect(parsed.items).toHaveLength(2);
    expect(parsed.items[1].id).toBe(2);
    expect(logSpy).toHaveBeenCalledWith(
      `Added item 2 to ${realpathSync(filePath)}`
    );
    expect(errorSpy).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
  });
});
