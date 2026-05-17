# Autonomous Continuous Workflow

Date: 2026-05-17

## Purpose

Define the standard workflow for this repo so the user can give a high-level goal and the agent can automatically brainstorm, write specs, create plans, implement, verify, and commit without needing repeated manual prompts.

The workflow applies to both:

- Story production, such as continuing `dao-khe-truong-sinh`.
- Software implementation, such as the reader platform server and mobile app.

## Operating Principle

The agent should keep moving until the requested scope is complete.

The user should only be interrupted for decisions that are genuinely subjective, risky, costly, external, or impossible to infer from existing project context.

## Default Run Loop

For every non-trivial goal:

1. **Discover**
   - Read relevant docs, specs, plans, code, metadata, and current Git state.
   - Identify the current canonical source of truth.
   - Identify existing conventions before creating new ones.

2. **Brainstorm**
   - Generate viable options internally.
   - Reject options that conflict with existing project direction.
   - Choose a conservative default when the user has already approved the general direction.
   - Ask only if the choice is subjective or materially changes the project.

3. **Spec**
   - Create or update a spec when the work changes product behavior, architecture, story canon, data model, APIs, workflow, or public output.
   - Keep the spec decision-oriented: goals, non-goals, constraints, chosen design, and acceptance criteria.

4. **Plan**
   - Create or update a plan when the work spans multiple steps or files.
   - Plan in executable batches with verification and commit points.
   - Prefer small completed batches over a large uncommitted change.

5. **Implement**
   - Execute the next batch directly.
   - Follow local patterns.
   - For stories, write the next chapters from the approved outline.
   - For code, implement the smallest coherent slice that can be verified.

6. **Verify**
   - Run the checks appropriate to the changed area.
   - Fix issues immediately when possible.
   - Do not commit known-bad work.

7. **Commit**
   - Commit verified batches with clear messages.
   - Keep commits coherent by feature, chapter batch, or documentation unit.

8. **Continue**
   - Continue to the next batch until the scope is complete.
   - Stop only at a defined stop condition.

## Decision Gates

Ask the user only for these categories.

### Creative Taste

Ask when choosing:

- New story premise.
- Title.
- Main character identity.
- Tone, darkness level, romance direction, ending direction.
- Major arc outcome when not already outlined.

Do not ask when:

- Continuing from an approved story bible and outline.
- Naming routine chapters if the outline already defines the chapter title.
- Filling scene-level details that do not change canon.

### Architecture And Product

Ask when choosing:

- Monolith vs microservices if not already decided.
- Database or infrastructure provider.
- Auth model.
- Paid services.
- Breaking API changes.
- Public exposure of services.

Do not ask when:

- Implementing an approved architecture.
- Adding validation, tests, DTOs, mappers, or internal refactors that preserve behavior.

### External Or Risky Actions

Ask when:

- Pushing to a remote if auto-push was not explicitly requested.
- Deploying public services.
- Using credentials, billing, or private accounts.
- Deleting files or rewriting Git history.

Do not ask when:

- Running local read-only inspection.
- Running local tests and validation.
- Committing verified work.

## Story Workflow

### Inputs

Use, in order:

1. Root `AGENTS.md`.
2. Story-specific `story-bible.md`.
3. Story-specific `rules.md`.
4. Current arc outline.
5. Existing manuscript chapters.
6. Runtime reader format and `metadata.json`.

### Output Structure

For each story:

```text
<story-slug>/
  metadata.json
  cover_prompt.txt
  c1.md
  c2.md
  ...

docs/<story-slug>/
  00-index.md
  story-bible.md
  rules.md
  outline-arc-XX.md
  manuscript/
    arc-XX/
      chuong-XX-<slug>.md
```

### Batch Size

Default story batch size:

- 3 chapters per batch for active long-form drafting.
- Smaller batch if continuity risk is high.
- Larger batch only when chapters are short, formulaic, or explicitly requested.

### Story Acceptance Checklist

Each chapter must:

- Open with concrete pressure.
- Include a transaction, debt, promise, cost, or tradeoff.
- Make Lâm Thất win through observation, patience, calculation, or choosing the lesser loss.
- Keep Sổ Nợ as a source of data, not a direct solution.
- Give Tạ Thanh Nghi or key side characters their own goals when they appear.
- End with a line that changes the meaning of an earlier detail.
- Avoid long system lectures.

Each batch must:

- Export runtime `c<number>.md` files without `# Chương` headings.
- Update `metadata.json`.
- Update `total_chapters`.
- Update the story index current scope.
- Run validation.
- Commit.

## Code Workflow

### Inputs

Use, in order:

1. Root `AGENTS.md`.
2. Relevant specs in `docs/superpowers/specs/`.
3. Relevant plans in `docs/superpowers/plans/`.
4. Existing package scripts and tests.
5. Current code conventions.

### Batch Size

Default code batch size:

- One vertical feature slice, or
- One service/module boundary, or
- One verification/tooling improvement.

Avoid mixing unrelated product, infra, and formatting changes.

### Code Acceptance Checklist

Each batch must:

- Match the chosen architecture.
- Preserve public contracts unless a migration is explicitly part of the task.
- Include or update tests when behavior changes.
- Run the most relevant available checks.
- Commit after verification.

## Stop Conditions

Stop and report when:

- The requested scope is complete.
- A required user decision gate is reached.
- A required credential, account, paid service, or external permission is missing.
- A local toolchain/dependency blocker cannot be fixed without changing system setup.
- Continuing would require destructive or irreversible action.

When stopping, report:

- What was completed.
- What was verified.
- What commit contains the work, if any.
- The exact decision or blocker needed next.

## Default Commands For Story Batches

Metadata validation pattern:

```bash
node -e "const fs=require('fs'); const m=JSON.parse(fs.readFileSync('<slug>/metadata.json','utf8')); const ok=m.total_chapters===m.chapters.length && m.chapters.every((c,i)=>c.number===i+1 && c.title && Object.prototype.hasOwnProperty.call(c,'url') && fs.existsSync('<slug>/c'+c.number+'.md')); console.log(ok ? 'metadata ok '+m.total_chapters : 'metadata bad'); if(!ok) process.exit(1);"
```

Runtime heading check:

```bash
rg -n '^# Chương' <slug>/c*.md
```

Expected result: no matches.

Placeholder check:

```bash
rg -n 'TBD|PLACEHOLDER' docs/<slug> <slug>
```

Expected result: no matches.

Whitespace check:

```bash
git diff --check
```

Expected result: no output and exit code 0.

## Current Repo Policy

As of 2026-05-17:

- Auto-commit verified batches: yes.
- Auto-push: no, unless the user asks or explicitly enables it for a task.
- Default story batch: 3 chapters.
- Default story runtime format: root `c<number>.md` body-only, title in `metadata.json`.
- Default active story continuation: `dao-khe-truong-sinh` Arc 2 from `outline-arc-02.md`.

