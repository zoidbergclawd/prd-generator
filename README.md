# PRD Generator

A skill for AI coding agents (Claude Code, Codex CLI) that generates Product Requirements Documents (PRDs) compatible with [Ralph CLI](https://github.com/zoidbergclawd/sisyphus).

## What It Does

When you describe a project you want to build, this skill helps the AI generate a complete, well-structured PRD that Ralph can execute autonomously.

## Usage with Claude Code

```bash
cd your-project
claude

# Then ask:
> Generate a PRD for a REST API that manages a todo list with user authentication
```

Claude will generate a complete `prd.json` following the Ralph format.

## Usage with Codex CLI

```bash
cd your-project
codex "Generate a PRD for a CLI tool that backs up files to S3"
```

## PRD Format

PRDs follow this structure:

```json
{
  "project": "Project Name",
  "goal": "One-line description",
  "tech_stack": {
    "language": "TypeScript",
    "framework": "Next.js",
    "testing": "Vitest"
  },
  "context": {
    "target_user": "Who this is for",
    "constraints": "Key limitations"
  },
  "items": [
    {
      "id": 1,
      "category": "setup",
      "title": "Test infrastructure",
      "description": "Set up testing framework",
      "priority": 1,
      "passes": false,
      "verification": "npm test passes",
      "steps": ["Install vitest", "Create config", "Add example test"]
    }
  ]
}
```

## Key Rules

1. **Test infrastructure must be item 1 or 2** - Ralph requires passing tests
2. **Every item needs testable verification** - Specific commands or test assertions
3. **Steps should include writing tests** - Tests are mandatory, not optional
4. **Priority 1 items run first** - Structure dependencies correctly

## Installation

Just clone this repo into your project or reference the CLAUDE.md:

```bash
# Option 1: Clone
git clone https://github.com/zoidbergclawd/prd-generator.git

# Option 2: Copy CLAUDE.md to your project
curl -O https://raw.githubusercontent.com/zoidbergclawd/prd-generator/main/CLAUDE.md
```

## Links

- [Ralph CLI (Sisyphus)](https://github.com/zoidbergclawd/sisyphus) - Executes PRDs autonomously
- [Ralph Dashboard](https://github.com/zoidbergclawd/ralph-dashboard) - Watch builds in real-time
