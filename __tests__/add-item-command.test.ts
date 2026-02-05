import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { runAddItem } from "../src/add-item-command";
import type { PRD } from "../src/types";
import { isValidPRD } from "../src/validator";

describe("runAddItem", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs) {
      rmSync(dir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  it("appends a new item to prd.json with auto-incremented id", async () => {
    const cwd = mkdtempSync(path.join(os.tmpdir(), "prd-add-item-"));
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
              title: "Existing item",
              verification: "Exists",
              steps: ["Do existing step"],
            },
          ],
        },
        null,
        2
      )
    );

    const prompt = vi.fn().mockResolvedValue({
      category: "cli",
      title: "Add-item command",
      description: "Add new item from CLI",
      priority: "2",
      verification: "prd-gen add-item appends to prd.json",
      steps: "Add subcommand, Prompt for details, Append item",
      notes: "",
    });

    const result = await runAddItem(
      { cwd },
      {
        prompt,
      }
    );

    const parsed = JSON.parse(readFileSync(filePath, "utf8")) as PRD;

    expect(prompt).toHaveBeenCalledTimes(1);
    expect(result.outputPath).toBe(filePath);
    expect(parsed.items).toHaveLength(2);
    expect(parsed.items[1]).toEqual({
      id: 2,
      category: "cli",
      title: "Add-item command",
      description: "Add new item from CLI",
      priority: 2,
      passes: false,
      verification: "prd-gen add-item appends to prd.json",
      steps: ["Add subcommand", "Prompt for details", "Append item"],
    });
    expect(isValidPRD(parsed)).toBe(true);
  });

  it("increments from the max existing id, not item count", async () => {
    const cwd = mkdtempSync(path.join(os.tmpdir(), "prd-add-item-"));
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
              id: 3,
              title: "First",
              verification: "ok",
              steps: ["one"],
            },
            {
              id: 7,
              title: "Second",
              verification: "ok",
              steps: ["two"],
            },
          ],
        },
        null,
        2
      )
    );

    const prompt = vi.fn().mockResolvedValue({
      category: "cli",
      title: "Third",
      description: "Third description",
      priority: "4",
      verification: "ok",
      steps: "three",
      notes: "Extra context",
    });

    await runAddItem(
      { cwd },
      {
        prompt,
      }
    );

    const parsed = JSON.parse(readFileSync(filePath, "utf8")) as PRD;

    expect(parsed.items[2].id).toBe(8);
    expect(parsed.items[2].notes).toBe("Extra context");
  });
});
