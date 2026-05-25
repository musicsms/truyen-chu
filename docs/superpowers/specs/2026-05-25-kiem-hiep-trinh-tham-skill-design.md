# Skill Design: Viết Truyện Kiếm Hiệp Trinh Thám

**Date:** 2026-05-25
**Status:** Approved

---

## Overview

A bilingual skill (English instructions, Vietnamese examples) for writing wuxia detective fiction (kiếm hiệp trinh thám). Covers the full workflow from mystery design through chapter writing and fair-play verification. Integrates with the repo's existing conventions (story-bible, outline arcs, metadata.json, chapter files).

**Style:** Not tied to a single author — covers both Gu Long (short, sharp, mystery-centric) and Jin Yong (broad world, mystery as arc) approaches, user selects tone per story.

---

## Core Principle

**Mystery first, world second.** The world exists to make the mystery believable, not the other way around. This is the key correction over naive world-first approaches.

---

## File Structure

```
~/.claude/skills/viet-truyen-kiem-hiep-trinh-tham/
├── SKILL.md                    # Orchestrator: triggers, 5-step workflow, which file to use when
├── mystery-board-template.md   # Step 1: who, how, why, 3 clues, 2 red herrings, martial arts limits
├── story-bible-template.md     # Step 2: world built to support the mystery
├── outline-arc-template.md     # Step 3: mystery distributed across chapters, clue placement
└── fair-play-checklist.md      # Step 5: pre-commit check before each reveal chapter
```

---

## Workflow (5 Steps — Order Is Non-Negotiable)

```
Step 1: Mystery Board
  → Fill mystery-board-template.md
  → Must know: killer, method, motive, 3 true clues, 2 red herrings
  → Must define: martial arts limits that make the crime possible AND fair

Step 2: Story Bible
  → Fill story-bible-template.md — only what the mystery requires
  → Power map (sects, hierarchy), martial arts fingerprints, jianghu law
  → Do NOT build beyond what Step 1 needs

Step 3: Outline Arc
  → Fill outline-arc-template.md
  → Distribute clues across chapters (never add a clue after it's needed)
  → Mark reveal chapters explicitly

Step 4: Write Chapters
  → Follow outline; tone guidance in SKILL.md
  → Clues presented to reader and protagonist simultaneously (fair play)
  → Combat serves investigation, not the other way around

Step 5: Fair-Play Check (before each reveal chapter)
  → Run fair-play-checklist.md
  → Every planted clue must be accounted for in the reveal
  → No "the master could have done it" explanations for impossible crimes
```

---

## Repo Integration

- New story: create `docs/<story-name>/` with story-bible.md, rules.md, outline-arc-01.md from templates
- Chapter files: `<story-name>/c<number>.md` — body text only, no `# Chương` headings
- `metadata.json`: update after every chapter batch (title, total_chapters, chapter list)
- Commit convention: follow existing repo git rules in AGENTS.md

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Mystery-first order | Gu Long approach: world serves mystery, not reverse |
| Templates over inline guidance | User wants to go from idea → first chapter with minimal rethinking |
| Bilingual skill | Instructions in English; examples in Vietnamese for natural integration |
| Fair-play as separate checklist | Prevents retroactive clue insertion — must be checked, not remembered |
| Martial arts limits in Step 1 | Locked-room paradoxes break if limits aren't established before writing begins |

---

## Out of Scope

- Cultivation/xianxia mechanics (different genre)
- Romance arc structure (not primary to this genre)
- Multi-POV management (skill assumes single investigator POV as default)
