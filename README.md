# PRD Generator

Generate Ralph-compatible `prd.json` files from project descriptions and maintain them from the command line.

Ralph CLI link: https://github.com/zoidbergclawd/sisyphus

## Installation

```bash
git clone https://github.com/zoidbergclawd/prd-generator.git
cd prd-generator
npm install
npm run build
```

Optional: make `prd-gen` available globally in your shell for this local checkout.

```bash
npm link
```

## CLI Usage

```bash
prd-gen --help
```

Commands:

- `prd-gen init` - interactively create `prd.json` in the current directory
- `prd-gen validate <file>` - validate a PRD JSON file
- `prd-gen add-item` - interactively append a new item to an existing `prd.json`

## Examples

### 1. Create a PRD

```bash
mkdir demo-api && cd demo-api
prd-gen init
```

When prompted, choose a starter template or `Blank PRD`, then provide:

- project name
- goal
- tech stack (`language, framework, testing`)
- target user

Result: a validated `prd.json` is written to the current directory.

### 2. Validate a PRD

```bash
prd-gen validate prd.json
```

Success output:

```text
PRD is valid: prd.json
```

Failure output includes all validation errors and exits with code `1`.

### 3. Add a New Item

```bash
prd-gen add-item
```

Prompts collect category, title, description, priority, verification, steps, and optional notes. The command appends a new item with the next numeric `id`.

## Template Customization

Built-in template names shown in `init` are:

- `typescript-cli`
- `nextjs-app`
- `python-cli`
- `blank`

To customize templates:

1. Edit template JSON files in `src/templates/`.
2. Keep template structure Ralph-compatible (`project`, `goal`, `tech_stack`, `context`, `items`).
3. Ensure each item has testable `verification` and actionable `steps`.
4. Rebuild after edits:

```bash
npm run build
```

Template files:

- `src/templates/typescript-cli.json`
- `src/templates/nextjs-app.json`
- `src/templates/python-cli.json`

## Ralph Compatibility Notes

- Keep test infrastructure in the first one or two items.
- Use concrete verification criteria that can be executed or asserted.
- Prioritize dependency order with `priority` (lower number runs earlier).

## Related Links

- Ralph CLI: https://github.com/zoidbergclawd/sisyphus
- Ralph Dashboard: https://github.com/zoidbergclawd/ralph-dashboard
