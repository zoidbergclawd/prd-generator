import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { runInit } from "../src/init-command";
import type { PRD } from "../src/types";
import { isValidPRD } from "../src/validator";

describe("runInit", () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs) {
      rmSync(dir, { recursive: true, force: true });
    }
    tempDirs.length = 0;
  });

  it("writes a valid blank PRD to prd.json", async () => {
    const cwd = mkdtempSync(path.join(os.tmpdir(), "prd-init-"));
    tempDirs.push(cwd);

    const prompt = vi.fn().mockResolvedValue({
      templateName: "blank",
      projectName: "My CLI",
      goal: "Generate PRDs quickly",
      techStack: "TypeScript, Node.js, Vitest",
      targetUser: "Developers",
    });

    const result = await runInit(
      { cwd },
      {
        prompt,
      }
    );

    const parsed = JSON.parse(readFileSync(result.outputPath, "utf8")) as PRD;

    expect(prompt).toHaveBeenCalledTimes(1);
    expect(path.basename(result.outputPath)).toBe("prd.json");
    expect(parsed.project).toBe("My CLI");
    expect(parsed.goal).toBe("Generate PRDs quickly");
    expect(parsed.tech_stack).toEqual({
      language: "TypeScript",
      framework: "Node.js",
      testing: "Vitest",
    });
    expect(parsed.context.target_user).toBe("Developers");
    expect(parsed.items).toEqual([]);
    expect(isValidPRD(parsed)).toBe(true);
  });

  it("prompts with blank + template choices", async () => {
    const cwd = mkdtempSync(path.join(os.tmpdir(), "prd-init-"));
    tempDirs.push(cwd);

    const prompt = vi.fn().mockResolvedValue({
      templateName: "blank",
      projectName: "Prompted Project",
      goal: "Prompted Goal",
      techStack: "TypeScript, Node.js, Vitest",
      targetUser: "Engineers",
    });

    await runInit(
      { cwd },
      {
        prompt,
        getTemplateNames: vi.fn().mockReturnValue(["nextjs-app", "python-cli"]),
      }
    );

    expect(prompt).toHaveBeenCalledTimes(1);
    const [questions] = prompt.mock.calls[0] as [Array<Record<string, unknown>>];
    const templateQuestion = questions.find(
      (question) => question.name === "templateName"
    ) as { choices?: Array<{ value: string }> };

    const choiceValues = (templateQuestion.choices ?? []).map(
      (choice) => choice.value
    );
    expect(choiceValues).toEqual(["blank", "nextjs-app", "python-cli"]);
  });

  it("uses the selected template and overwrites prompted fields", async () => {
    const cwd = mkdtempSync(path.join(os.tmpdir(), "prd-init-"));
    tempDirs.push(cwd);

    const template: PRD = {
      project: "Template Project",
      goal: "Template Goal",
      tech_stack: {
        language: "Python",
        framework: "FastAPI",
        testing: "Pytest",
      },
      context: {
        target_user: "Template user",
        constraints: "Template constraints",
      },
      items: [
        {
          id: 1,
          category: "setup",
          title: "Template item",
          description: "Template description",
          priority: 1,
          passes: false,
          verification: "Template verification",
          steps: ["Template step"],
        },
      ],
    };

    const prompt = vi.fn().mockResolvedValue({
      templateName: "python-cli",
      projectName: "Custom Project",
      goal: "Custom Goal",
      techStack: "Go",
      targetUser: "Operators",
    });

    const result = await runInit(
      { cwd },
      {
        prompt,
        loadTemplate: vi.fn().mockReturnValue(template),
      }
    );

    const parsed = JSON.parse(readFileSync(result.outputPath, "utf8")) as PRD;

    expect(parsed.project).toBe("Custom Project");
    expect(parsed.goal).toBe("Custom Goal");
    expect(parsed.tech_stack).toEqual({
      language: "Go",
      framework: "FastAPI",
      testing: "Pytest",
    });
    expect(parsed.context.target_user).toBe("Operators");
    expect(parsed.context.constraints).toBe("Template constraints");
    expect(parsed.items).toHaveLength(1);
    expect(isValidPRD(parsed)).toBe(true);
  });
});
