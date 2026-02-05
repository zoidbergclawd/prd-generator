import { describe, expect, expectTypeOf, it } from "vitest";

import type { PRD, PRDItem, TechStack } from "../src/types";

describe("PRD schema types", () => {
  it("matches the expected TechStack structure", () => {
    expectTypeOf<TechStack>().toEqualTypeOf<{
      language: string;
      framework: string;
      testing: string;
    }>();
  });

  it("matches the expected PRDItem structure", () => {
    expectTypeOf<PRDItem>().toEqualTypeOf<{
      id: number;
      category: string;
      title: string;
      description: string;
      priority: number;
      passes: boolean;
      verification: string;
      steps: string[];
      notes?: string;
    }>();
  });

  it("matches the expected PRD structure", () => {
    expectTypeOf<PRD>().toEqualTypeOf<{
      project: string;
      goal: string;
      tech_stack: TechStack;
      context: {
        target_user: string;
        constraints: string;
        references?: string;
      };
      items: PRDItem[];
    }>();
  });

  it("can type a valid Ralph-compatible PRD document", () => {
    const prd: PRD = {
      project: "PRD Generator",
      goal: "Generate Ralph-compatible PRDs",
      tech_stack: {
        language: "TypeScript",
        framework: "Node.js CLI",
        testing: "Vitest",
      },
      context: {
        target_user: "Developers",
        constraints: "Must output valid JSON",
      },
      items: [
        {
          id: 1,
          category: "setup",
          title: "Test infrastructure",
          description: "Set up test runner",
          priority: 1,
          passes: false,
          verification: "npm test passes",
          steps: ["Install vitest", "Add initial tests"],
        },
      ],
    };

    expect(prd.project).toBe("PRD Generator");
    expect(prd.items[0].steps.length).toBeGreaterThan(0);
  });
});
