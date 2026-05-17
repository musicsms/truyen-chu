# Agent Workflow Policy

This repo uses an autonomous execution workflow. When the user gives a goal, the agent should continue from discovery through delivery without waiting for step-by-step commands.

## Default Mode

Use continuous execution by default:

1. Discover existing docs, code, content, metadata, and repo conventions.
2. Brainstorm options internally and choose a conservative direction that fits existing patterns.
3. Write or update the relevant spec when the goal changes product, architecture, story canon, workflow, or public behavior.
4. Write or update an implementation plan for multi-step work.
5. Implement in small batches.
6. Verify each batch with repo-appropriate checks.
7. Commit completed batches with clear messages.
8. Continue until the requested scope is complete or a documented stop condition is reached.

Do not stop after proposing a plan unless the user explicitly asks for planning only.

## Ask The User Only At Decision Gates

Ask for input only when the answer is subjective, irreversible, external, costly, or impossible to infer safely from repo context.

Examples that require user input:

- Choosing story premise, title, protagonist, tone, ending direction, romance direction, or other creative taste decisions.
- Choosing architecture tradeoffs with lasting consequences, such as monolith vs microservices, auth provider, database engine, paid infrastructure, or public API breakage.
- Publishing or exposing something externally when not already authorized.
- Destructive Git or filesystem operations.
- Secrets, credentials, billing, subscriptions, or private accounts.
- Legal, financial, or medical decisions.

Examples that should not require user input:

- Creating specs, plans, outlines, and checklists from an already approved goal.
- Continuing the next chapter or next implementation batch from an approved outline.
- Updating metadata when adding chapters.
- Running local validation, tests, format checks, and non-destructive Git status/diff/log commands.
- Committing coherent completed batches after verification.

When asking, ask the minimum number of questions needed and continue immediately after the user answers.

## Story Content Rules

For generated story folders, preserve the reader format:

- Root story folder contains `metadata.json`, `cover_prompt.txt`, and chapter files named `c<number>.md`.
- Runtime chapter files must contain body text only. Do not include `# Chương` headings in root `c<number>.md` files.
- Chapter titles belong in `metadata.json`.
- Every new runtime chapter must update `metadata.json` and `total_chapters`.
- Manuscript docs may keep chapter headings under `docs/<story>/manuscript/...`.
- Use the story's `story-bible.md`, `rules.md`, and outline as canon before writing.

For `dao-khe-truong-sinh`, follow:

- `docs/dao-khe-truong-sinh/story-bible.md`
- `docs/dao-khe-truong-sinh/rules.md`
- `docs/dao-khe-truong-sinh/outline-arc-02.md` when continuing Arc 2.

## Verification Rules

Before committing story batches, verify:

- `metadata.json` parses.
- `total_chapters` equals the chapter list length.
- Chapter numbers are sequential.
- Each chapter file referenced by metadata exists.
- Runtime chapter files do not contain `# Chương` headings.
- No placeholders such as `TBD` or `PLACEHOLDER` remain.
- `git diff --check` passes.

Before committing code batches, run the most relevant local checks available for the changed area. Prefer project scripts over ad hoc commands.

## Git Rules

- Never revert user changes unless explicitly asked.
- Commit coherent completed batches after verification.
- Do not rewrite history unless explicitly asked.
- Push only when the user asks, or when a repo-specific task explicitly includes auto-push as part of the requested workflow.

