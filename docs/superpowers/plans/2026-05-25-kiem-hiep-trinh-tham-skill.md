# Kiếm Hiệp Trinh Thám Skill — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 5-file template-driven skill at `~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/` that guides an agent through the full workflow of writing wuxia detective fiction in Vietnamese, from mystery design to chapter commits.

**Architecture:** SKILL.md acts as orchestrator — defines triggers and 5-step workflow, points to template files for each step. Templates are fill-in-the-blank documents that produce actual repo artifacts (story-bible.md, outline-arc-01.md, etc.) following existing AGENTS.md conventions. Mystery-board is always Step 1; world-building is Step 2 and constrained by what Step 1 requires.

**Tech Stack:** Markdown templates, YAML frontmatter (agentskills spec), Vietnamese/English bilingual prose.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/SKILL.md` | **Rewrite** (exists, wrong) | Orchestrator: trigger, 5-step workflow, file references |
| `~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/mystery-board-template.md` | **Create** | Step 1: killer, method, motive, clues, red herrings, martial arts limits |
| `~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/story-bible-template.md` | **Create** | Step 2: world built to support the mystery |
| `~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/outline-arc-template.md` | **Create** | Step 3: arc structure, clue placement per chapter |
| `~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/fair-play-checklist.md` | **Create** | Step 5: pre-commit check before each reveal chapter |

Step 4 (write chapters) is covered inline in SKILL.md — tone guidance, sentence rhythm, clue-embedding technique. No separate file needed.

---

## Task 1: Rewrite SKILL.md as Orchestrator

**Files:**
- Modify: `~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/SKILL.md` (full rewrite)

- [ ] **Step 1: Rewrite SKILL.md**

Replace the entire file with:

```markdown
---
name: viet-truyen-kiem-hiep-trinh-tham
description: Use when writing, planning, or expanding wuxia detective fiction (kiếm hiệp trinh thám) in Vietnamese — murder mysteries, locked-room puzzles, conspiracies, or cold cases set in the martial arts world (võ lâm). Triggers on prompts involving jianghu crime, wandering swordsman investigation, or mystery arcs in a wuxia setting.
---

# Viết Truyện Kiếm Hiệp Trinh Thám
*Wuxia Detective Fiction — Full Workflow Skill*

## When to Use

- Starting a new kiếm hiệp trinh thám story or arc
- Planning a mystery within an existing wuxia story
- Writing or reviewing a chapter that plants or reveals clues
- Stuck on how to make a crime feel fair and solvable in a world with martial arts

## The 5-Step Workflow (Order Is Non-Negotiable)

```
Step 1 → mystery-board-template.md   Fill BEFORE writing anything else
Step 2 → story-bible-template.md     Build ONLY what the mystery requires
Step 3 → outline-arc-template.md     Distribute clues across chapters
Step 4 → Write chapters              Tone and technique guidance below
Step 5 → fair-play-checklist.md      Run BEFORE every reveal chapter
```

**Why mystery first:** The world exists to make the crime believable and fair. A world built before the crime will contradict or over-explain it. Fill the mystery board first, then build only the world pieces it needs.

## Repo Integration

When starting a new story, create:
```
docs/<story-name>/
  story-bible.md          ← from story-bible-template.md
  rules.md                ← short: list constraints from mystery-board
  outline-arc-01.md       ← from outline-arc-template.md

<story-name>/
  metadata.json           ← title, total_chapters, chapter list
  c1.md, c2.md ...        ← body text only, no # Chương headings
```

Follow AGENTS.md conventions for all file formats and commit rules.

## Step 4: Writing Chapters — Technique Guide

### Tone (Style-Agnostic)

Choose one and stay consistent:

| Mode | Sentence rhythm | Dialogue | Emotion |
|------|----------------|----------|---------|
| Gu Long | Short, punchy. One breath per sentence. | Sparse, cuts deep | Subtext only — never stated |
| Jin Yong | Flowing, descriptive. Scenes breathe. | Rich, reveals character | Present in narration |
| Hybrid | Short in action/discovery. Long in reflection. | Medium density | Show via action |

### Embedding Clues (Fair Play Rule)

The reader must see every clue the protagonist sees — at the same time, in the same detail.

```
❌ WRONG: "Hoài Phong noticed something odd about the wound but said nothing."
          (Hides information from reader — unfair)

✅ RIGHT:  "The wound angled upward at 45 degrees. Unusual for a taller attacker.
           Hoài Phong did not comment. He filed the angle away."
          (Reader sees it; protagonist notes it but doesn't solve it yet — fair)
```

### Martial Arts as Investigation Tool

Clue formula: **Observation + Sect Knowledge + Deduction**

- Wound shape → identifies technique → identifies sect or training lineage
- Smell → identifies poison type → narrows to practitioners who know it
- Sound described by witness → identifies khinh công style → limits suspects by mobility

Combat scenes: allowed to create danger and raise stakes. Not allowed to solve mysteries. The killer is found by deduction, not defeated in battle.

### Chapter Pacing

| Chapter type | Sentence length | Info density | End on |
|-------------|----------------|--------------|--------|
| Investigation | Medium-long | High | Open question |
| Danger / confrontation | Short | Low | Cliffhanger |
| Revelation | Medium | Very high | Answer that raises new question |

Always end on a question, never an answer.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Building the world before knowing the crime | Do Step 1 first, always |
| "Khinh công explains everything" | Martial arts limits must be in mystery-board before writing |
| Adding a clue after it's needed for the reveal | Clue placement is locked in Step 3 — never add retroactively |
| Protagonist knows more than reader | Rewrite: show the observation explicitly |
| Combat resolves the mystery | Mystery resolves through deduction only |
| Reveal chapter explains clues not previously shown | Fair-play checklist catches this — run Step 5 |
```

- [ ] **Step 2: Verify frontmatter is under 1024 characters**

```bash
head -5 ~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/SKILL.md | wc -c
```

Expected: under 300 characters for the frontmatter block.

- [ ] **Step 3: Commit**

```bash
git -C ~ add .claude/skills/viet-truyen-kiem-hiep-trinh-tham/SKILL.md
git -C ~ commit -m "skill: rewrite SKILL.md as orchestrator for kiếm hiệp trinh thám"
```

---

## Task 2: Create mystery-board-template.md

**Files:**
- Create: `~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/mystery-board-template.md`

- [ ] **Step 1: Create the file**

```markdown
# Mystery Board
*Fill this completely before writing any prose. This is Step 1.*

---

## The Crime

**What happened (in one sentence):**
> [e.g., Bạch Hạc sect leader found dead in locked room, stabbed with his own sword]

**When:** [Time of day, weather, context — establishes alibis]

**Where:** [Exact location — room layout, access points, witnesses nearby]

---

## The Answer (Write This First)

**Killer:** [Name, relationship to victim]

**Method:** [Exactly how the crime was committed — no vagueness]

**Motive:** [Must connect to jianghu logic: sect rivalry, secret, betrayal, forbidden knowledge]

**Why no one suspected killer immediately:**
> [The alibi or misdirection that protects them through Act 1 and 2]

---

## Martial Arts Limits (Lock These In Now)

These limits apply for the entire story. They cannot be changed later.

**Khinh công:** [Maximum distance/height achievable. e.g., "Cannot clear a 4-thốn iron bar gap"]

**Ám khí range:** [Maximum effective range. e.g., "Needle-type: 3 trượng maximum"]

**Poison detection:** [Can it be smelled? Tasted? How long before symptoms?]

**Distinctive sect markers:** [What does each major sect's technique leave behind — wound angle, footprint, smell, sound]

**The impossible constraint:** [The one physical fact that makes this crime seem impossible — must be explainable within these limits]

---

## True Clues (Plant All Three in Step 3)

| # | Clue | Where planted (chapter) | How protagonist finds it | What it proves |
|---|------|--------------------------|--------------------------|----------------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Clue-planting rule:** All three must appear BEFORE the reveal chapter. Lock the chapter numbers in Step 3 before writing.

---

## Red Herrings (Two Required)

| # | False lead | Why it seems incriminating | Innocent explanation |
|---|-----------|---------------------------|----------------------|
| 1 | | | |
| 2 | | | |

---

## Suspects (Minimum 3, Including Killer)

Each suspect needs all four elements or they will not feel credible:

| Suspect | Motive | Means (martial arts) | Opportunity | Cover |
|---------|--------|----------------------|-------------|-------|
| [Killer] | | | | |
| [Red herring suspect 1] | | | | |
| [Red herring suspect 2] | | | | |

---

## Protagonist Stakes

**Why can't they walk away?**
> [Must be one of: accused of crime themselves / person they owe loyalty to is harmed / past secret forces them to resolve this]

**Their blind spot:**
> [One thing they will misread due to personal history — creates wrong-theory moment in Act 2]
```

- [ ] **Step 2: Commit**

```bash
git -C ~ add .claude/skills/viet-truyen-kiem-hiep-trinh-tham/mystery-board-template.md
git -C ~ commit -m "skill: add mystery-board-template.md (Step 1)"
```

---

## Task 3: Create story-bible-template.md

**Files:**
- Create: `~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/story-bible-template.md`

- [ ] **Step 1: Create the file**

```markdown
# Story Bible: [Tên Truyện]
*Fill AFTER mystery-board-template.md. Build only what the mystery requires.*

---

## Setting

**Era / dynasty:** [Historical or "thời gian mơ hồ" — vague period]

**Primary location:** [Town, mountain, sect compound — where most of story takes place]

**Atmosphere:** [One adjective: oppressive / elegant / desolate / festive]

---

## Power Map (Jianghu Factions)

*Only include factions that appear in the story or affect suspects' motives.*

### Major Sects

| Sect | Location | Signature martial art | Political stance | Attitude toward investigation |
|------|----------|----------------------|-----------------|-------------------------------|
| | | | | |
| | | | | |

### Minor Factions / Independents

| Name | Role in story | Allegiance |
|------|---------------|-----------|
| | | |

### Hắc Đạo (Underworld)

| Group | Territory | What they want |
|-------|-----------|----------------|
| | | |

---

## Jianghu Law & Social Rules

**Who has authority to judge crimes in jianghu:**
> [e.g., Only sect leaders of top-three sects can convene a tribunal]

**Taboos (violations lead to immediate pursuit):**
- [e.g., Killing unarmed civilians]
- [e.g., Stealing sect scriptures]
- [e.g., Revealing another sect's hidden technique]

**How disputes are normally resolved:**
> [Duel / tribunal / arbitration by neutral party]

---

## Martial Arts Fingerprints

*Copy limits from mystery-board. Add identifying details per sect.*

| Sect / style | Wound characteristics | Sound / smell | Footprint / movement pattern |
|-------------|----------------------|---------------|------------------------------|
| | | | |

---

## Key Locations

| Location | Who controls it | Access | Significance to mystery |
|----------|----------------|--------|-------------------------|
| | | | |

---

## Named Characters

| Name | Sect / affiliation | Role | Secret (if any) |
|------|-------------------|------|-----------------|
| [Protagonist] | | Investigator | |
| [Victim] | | | |
| [Killer] | | | |

---

## Rules.md Content (copy to docs/<story>/rules.md)

Short list of hard constraints for this story — used by all future agents writing chapters:

- [ ] [e.g., No new sects introduced after Chapter 5]
- [ ] [e.g., Protagonist does not kill — injures only]
- [ ] [e.g., All clues visible to reader at time protagonist sees them]
- [ ] [e.g., Khinh công limit: 4-thốn iron bar gap is impassable]
```

- [ ] **Step 2: Commit**

```bash
git -C ~ add .claude/skills/viet-truyen-kiem-hiep-trinh-tham/story-bible-template.md
git -C ~ commit -m "skill: add story-bible-template.md (Step 2)"
```

---

## Task 4: Create outline-arc-template.md

**Files:**
- Create: `~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/outline-arc-template.md`

- [ ] **Step 1: Create the file**

```markdown
# Arc Outline: [Tên Arc / Tên Truyện]
*Step 3. Distribute clues here. Clue placement is locked after this step.*

---

## Arc Summary

**Crime:** [One sentence from mystery-board]
**Resolution:** [How protagonist solves it — which clue combination]
**Emotional arc:** [What protagonist learns or loses by the end]

---

## Clue Placement (Fill from mystery-board before writing chapters)

| Clue | Planted in chapter | Method of discovery | Callback in reveal chapter |
|------|-------------------|--------------------|-----------------------------|
| Clue 1: | c | | c |
| Clue 2: | c | | c |
| Clue 3: | c | | c |
| Red herring 1: | c | | Explained away in c |
| Red herring 2: | c | | Explained away in c |

**Rule:** Chapter numbers must be filled in BEFORE writing any chapter. Adding clues retroactively is forbidden.

---

## Chapter-by-Chapter Outline

### Act 1: Discovery (Chapters 1–N)

**Goal:** Establish crime, introduce suspects, plant Clue 1.

| Chapter | Scene | Purpose | Clue / red herring | Ends on |
|---------|-------|---------|-------------------|---------|
| c1 | | Establish location, protagonist arrives | — | Question |
| c2 | | Crime discovered | Clue 1 planted | Question |
| c3 | | First interviews, suspects introduced | Red herring 1 planted | Question |

### Act 2: Investigation (Chapters N–M)

**Goal:** Deepen mystery, protagonist's wrong theory, plant Clues 2 and 3, danger escalates.

| Chapter | Scene | Purpose | Clue / red herring | Ends on |
|---------|-------|---------|-------------------|---------|
| c4 | | Expand investigation | Clue 2 planted | Question |
| c5 | | Protagonist forms wrong theory | Red herring 2 planted | Question |
| c6 | | Danger: killer strikes again or threatens protagonist | — | Cliffhanger |
| c7 | | Breakthrough: Clue 3 reframes everything | Clue 3 planted | Question |

### Act 3: Resolution (Chapters M–End)

**Goal:** Protagonist assembles clues, confronts killer, full explanation.

| Chapter | Scene | Purpose | Clue callback | Ends on |
|---------|-------|---------|--------------|---------|
| c8 | | Protagonist assembles evidence | Clues 1+2+3 | Question |
| c9 | | ⚠️ REVEAL — run fair-play-checklist.md first | All clues explained | Answer |
| c10 | | Aftermath, consequences for jianghu | — | Resolution |

---

## Pacing Notes

- Act 1 should feel like arrival and dread, not rush
- Act 2 midpoint (wrong theory) is where protagonist's blind spot from mystery-board activates
- No new suspects introduced after Act 2 begins
- Reveal chapter (c9 above) must account for ALL clues and ALL red herrings

---

## metadata.json Starter

```json
{
  "title": "[Tên Truyện]",
  "genre": "kiếm hiệp trinh thám",
  "total_chapters": 0,
  "chapters": []
}
```

Update `total_chapters` and `chapters` array after each committed batch.
```

- [ ] **Step 2: Commit**

```bash
git -C ~ add .claude/skills/viet-truyen-kiem-hiep-trinh-tham/outline-arc-template.md
git -C ~ commit -m "skill: add outline-arc-template.md (Step 3)"
```

---

## Task 5: Create fair-play-checklist.md

**Files:**
- Create: `~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/fair-play-checklist.md`

- [ ] **Step 1: Create the file**

```markdown
# Fair-Play Checklist
*Run this BEFORE writing any reveal chapter. If any item fails, fix the earlier chapters first.*

---

## Pre-Reveal Verification

**Story:** _______________
**Reveal chapter:** c___
**Date:** _______________

---

### Section 1: Clue Completeness

- [ ] **Clue 1** was shown to reader in c___. Exact passage: _______________________
- [ ] **Clue 2** was shown to reader in c___. Exact passage: _______________________
- [ ] **Clue 3** was shown to reader in c___. Exact passage: _______________________

If any clue has no passage yet → **STOP. Plant the clue first. Then return.**

---

### Section 2: Red Herring Resolution

- [ ] **Red herring 1** (c___): innocent explanation will be given in reveal ✓
- [ ] **Red herring 2** (c___): innocent explanation will be given in reveal ✓

---

### Section 3: Martial Arts Logic

- [ ] The killer's method is possible within the limits defined in mystery-board
- [ ] No new martial arts ability is introduced in the reveal to explain the crime
- [ ] The "impossible" constraint has a mundane explanation within established limits

If killer needs an ability not established → **STOP. Either establish it earlier or change the method.**

---

### Section 4: Protagonist Knowledge

- [ ] Every deduction the protagonist makes in the reveal was available to the reader
- [ ] No deduction relies on information the protagonist gathered off-page
- [ ] Reader could have solved it before the reveal chapter (given the clues)

---

### Section 5: Suspect Coverage

- [ ] All suspects introduced in Act 1 are either eliminated or named as killer
- [ ] No suspect disappears without explanation
- [ ] Killer had motive + means + opportunity (all three confirmed in mystery-board)

---

## If All Boxes Checked

Write the reveal chapter. In the reveal, address clues in the order they were planted. Do not introduce new information — only connect what the reader already saw.

## If Any Box Fails

Fix earlier chapters first. Do not write the reveal chapter until all boxes pass. Commit the fixes before running this checklist again.
```

- [ ] **Step 2: Commit**

```bash
git -C ~ add .claude/skills/viet-truyen-kiem-hiep-trinh-tham/fair-play-checklist.md
git -C ~ commit -m "skill: add fair-play-checklist.md (Step 5)"
```

---

## Task 6: End-to-End Verification

**Files:** None created — read-only test.

- [ ] **Step 1: Verify all files exist**

```bash
ls -la ~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/
```

Expected output (5 files):
```
SKILL.md
fair-play-checklist.md
mystery-board-template.md
outline-arc-template.md
story-bible-template.md
```

- [ ] **Step 2: Check SKILL.md frontmatter**

```bash
head -4 ~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/SKILL.md
```

Expected: `---`, `name: viet-truyen-kiem-hiep-trinh-tham`, `description: Use when...`, `---`

- [ ] **Step 3: Verify skill appears in skill list**

In a new Claude Code session, type `/skills` or check that the skill name `viet-truyen-kiem-hiep-trinh-tham` appears in the available skills system reminder.

- [ ] **Step 4: Spot-check template completeness**

```bash
grep -c "FILL\|PLACEHOLDER\|TBD\|TODO" \
  ~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/*.md
```

Expected: all zeros (no placeholders).

- [ ] **Step 5: Final commit for plan tracking**

```bash
git -C /home/ubuntu/truyen-chu add docs/superpowers/plans/2026-05-25-kiem-hiep-trinh-tham-skill.md
git -C /home/ubuntu/truyen-chu commit -m "docs: add implementation plan for kiếm hiệp trinh thám skill"
```
