# PRD Generator Skill

A skill for Claude Code and Codex CLI that generates Product Requirements Documents (PRDs) in the Ralph/Sisyphus format.

## Usage

When a user describes a project they want to build, generate a complete PRD JSON file following the schema below.

## PRD Schema

```json
{
  "project": "string - Project name",
  "goal": "string - One-line project goal",
  "tech_stack": {
    "language": "string - Primary language",
    "framework": "string - Main framework (optional)",
    "testing": "string - Test framework",
    "notes": "string - Additional tech notes (optional)"
  },
  "context": {
    "target_user": "string - Who this is for",
    "constraints": "string - Key constraints",
    "references": "string - Reference projects/docs (optional)"
  },
  "items": [
    {
      "id": 1,
      "category": "setup|core|api|ui|config|polish|docs",
      "title": "string - Short title",
      "description": "string - What this item accomplishes",
      "priority": 1,
      "passes": false,
      "verification": "string - How to verify completion (must be testable)",
      "steps": ["string - Step 1", "string - Step 2"],
      "notes": "string - Optional notes"
    }
  ]
}
```

## Rules for Generating PRDs

1. **Item 1 or 2 MUST be "Test infrastructure"** - Ralph requires tests to pass before checkpointing
2. **Every item needs testable verification** - "Unit tests pass" or specific command output
3. **Steps should include writing tests** - Add "Write unit tests in __tests__/foo.test.ts" as a step
4. **Priority ordering matters** - Priority 1 items run first, then 2, then 3
5. **Categories help organization** - Use: setup, core, api, ui, config, polish, docs
6. **Keep items focused** - One logical unit of work per item
7. **10-20 items is typical** - Break down large projects appropriately

## Example Interaction

User: "I want to build a CLI tool that converts markdown to HTML"

You generate:

```json
{
  "project": "md2html",
  "goal": "CLI tool that converts Markdown files to HTML with syntax highlighting",
  "tech_stack": {
    "language": "TypeScript",
    "framework": "Node.js CLI (commander)",
    "testing": "Vitest"
  },
  "context": {
    "target_user": "Developers who need quick markdown conversion",
    "constraints": "Single binary, no external dependencies at runtime"
  },
  "items": [
    {
      "id": 1,
      "category": "setup",
      "title": "Project scaffolding",
      "description": "Initialize TypeScript project with build setup",
      "priority": 1,
      "passes": false,
      "verification": "npm run build succeeds",
      "steps": [
        "Create package.json with TypeScript and build scripts",
        "Create tsconfig.json",
        "Create src/index.ts entry point"
      ]
    },
    {
      "id": 2,
      "category": "setup", 
      "title": "Test infrastructure",
      "description": "Set up Vitest for unit testing",
      "priority": 1,
      "passes": false,
      "verification": "npm test runs and passes with example test",
      "steps": [
        "Install vitest",
        "Create vitest.config.ts",
        "Add test script to package.json",
        "Create __tests__/example.test.ts with passing test"
      ]
    }
  ]
}
```

## Output

Always output the PRD as a fenced JSON code block that can be saved directly to a file like `prd.json`.
