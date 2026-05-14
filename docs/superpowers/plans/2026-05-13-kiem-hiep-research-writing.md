# Kiem Hiep Research And Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete creative dossier and a finished draft-zero story package for the original wuxia/noir novella defined in `docs/superpowers/specs/2026-05-13-kiem-hiep-research-design.md`.

**Architecture:** The project is documentation-first. Research modules establish reusable principles, the rules document converts those principles into writing constraints, the story bible fixes continuity, the outline maps the whole 24-chapter arc, and the manuscript file delivers a complete draft-zero version of the story.

**Tech Stack:** Markdown files under `docs/`; verification through file existence, internal consistency checks, and text scans for unfinished markers or accidental reliance on copyrighted names/settings.

---

## File Structure

- Modify: `docs/superpowers/specs/2026-05-13-kiem-hiep-research-design.md` to finish Vietnamese diacritics and keep the design readable.
- Create: `docs/kiem-hiep/00-index.md` as the navigation entry point.
- Create: `docs/kiem-hiep/research/01-giang-ho-va-quyen-luc.md` for society, factions, locations, and power logic.
- Create: `docs/kiem-hiep/research/02-nhan-vat-trung-tam.md` for protagonist, supporting cast, and antagonist design.
- Create: `docs/kiem-hiep/research/03-dao-nghia-va-xung-dot.md` for moral pressure, vows, debts, and costs.
- Create: `docs/kiem-hiep/research/04-bi-mat-va-nhip-trinh-tham.md` for mystery engine, clues, false leads, and reveal cadence.
- Create: `docs/kiem-hiep/research/05-vo-hoc-va-canh-dau.md` for martial logic and fight-scene rules.
- Create: `docs/kiem-hiep/research/06-doi-thoai-va-giong-ke.md` for dialogue, prose rhythm, and voice constraints.
- Create: `docs/kiem-hiep/rules.md` as the consolidated writing rulebook.
- Create: `docs/kiem-hiep/story-bible.md` for title, premise, factions, characters, backstory, clues, and continuity.
- Create: `docs/kiem-hiep/outline-24-chapters.md` for the full four-act, 24-chapter outline.
- Create: `docs/kiem-hiep/manuscript/draft-zero.md` for the complete draft-zero novella in compact chapter prose.

## Tasks

### Task 1: Finish And Verify The Design Spec

**Files:**
- Modify: `docs/superpowers/specs/2026-05-13-kiem-hiep-research-design.md`

- [ ] **Step 1: Scan the spec for remaining Vietnamese text without diacritics**

Run: `rg "Bo |Quy tac|Truyen|Hoi |Nhan vat|Tieu chi|Buoc|Lap |Tao |Gioi han" docs/superpowers/specs/2026-05-13-kiem-hiep-research-design.md`

Expected: no matches that indicate remaining unaccented section titles or bullet text.

- [ ] **Step 2: Read the whole spec**

Run: `sed -n '1,220p' docs/superpowers/specs/2026-05-13-kiem-hiep-research-design.md`

Expected: all sections are legible Vietnamese with the same scope as the original design.

- [ ] **Step 3: Commit-ready status check**

Run: `git diff -- docs/superpowers/specs/2026-05-13-kiem-hiep-research-design.md`

Expected: changes are limited to diacritics and wording cleanup, with no scope changes.

### Task 2: Create Research Modules

**Files:**
- Create: `docs/kiem-hiep/research/01-giang-ho-va-quyen-luc.md`
- Create: `docs/kiem-hiep/research/02-nhan-vat-trung-tam.md`
- Create: `docs/kiem-hiep/research/03-dao-nghia-va-xung-dot.md`
- Create: `docs/kiem-hiep/research/04-bi-mat-va-nhip-trinh-tham.md`
- Create: `docs/kiem-hiep/research/05-vo-hoc-va-canh-dau.md`
- Create: `docs/kiem-hiep/research/06-doi-thoai-va-giong-ke.md`

- [ ] **Step 1: Write six modules using the approved template**

Each file must include these exact headings:

```markdown
# [Module Title]

## Chức năng
## Nguyên lý tham chiếu
## Chuyển hóa cho truyện gốc
## Checklist áp dụng
## Lỗi cần tránh
## Ví dụ mini
```

Expected: every module gives practical writing rules and at least one original mini example.

- [ ] **Step 2: Verify required headings**

Run: `for f in docs/kiem-hiep/research/*.md; do printf '%s\n' "$f"; rg "^## (Chức năng|Nguyên lý tham chiếu|Chuyển hóa cho truyện gốc|Checklist áp dụng|Lỗi cần tránh|Ví dụ mini)$" "$f"; done`

Expected: every file prints all six required headings.

### Task 3: Create Consolidated Rulebook

**Files:**
- Create: `docs/kiem-hiep/rules.md`

- [ ] **Step 1: Write the rulebook**

The rulebook must include:

```markdown
# Bộ quy tắc sáng tác

## Quy tắc mở chương
## Quy tắc đóng chương
## Quy tắc cảnh đấu
## Quy tắc bí mật
## Quy tắc giang hồ
## Quy tắc nhân vật
## Quy tắc giọng văn
## Bảng kiểm trước khi viết một chương
```

Expected: rules are specific enough to apply while drafting chapters.

- [ ] **Step 2: Verify rulebook headings**

Run: `rg "^## " docs/kiem-hiep/rules.md`

Expected: all eight headings listed above appear once.

### Task 4: Create Story Bible

**Files:**
- Create: `docs/kiem-hiep/story-bible.md`

- [ ] **Step 1: Write the story bible**

The bible must include:

```markdown
# Hồ sơ truyện: Mưa Trên Bến Không Đèn

## Logline
## Luận đề
## Bối cảnh
## Đại án năm xưa
## Vụ án hiện tại
## Nhân vật chính
## Tuyến nhân vật
## Thế lực giang hồ
## Hệ võ học
## Manh mối và sự thật
## Quy tắc continuity
```

Expected: the story has original names, factions, methods, clues, and ending logic.

- [ ] **Step 2: Verify story-bible headings**

Run: `rg "^## " docs/kiem-hiep/story-bible.md`

Expected: all eleven headings listed above appear once.

### Task 5: Create Full Chapter Outline

**Files:**
- Create: `docs/kiem-hiep/outline-24-chapters.md`

- [ ] **Step 1: Write the 24-chapter outline**

The outline must use four acts and 24 chapter entries. Each chapter entry must include:

```markdown
### Chương N: [Title]

- Mở chương:
- Diễn biến:
- Manh mối:
- Giá phải trả:
- Đóng chương:
```

Expected: each act resolves one question and opens a larger one.

- [ ] **Step 2: Verify chapter count**

Run: `rg "^### Chương " docs/kiem-hiep/outline-24-chapters.md | wc -l`

Expected: `24`.

### Task 6: Create Complete Draft-Zero Manuscript

**Files:**
- Create: `docs/kiem-hiep/manuscript/draft-zero.md`

- [ ] **Step 1: Write the complete compact manuscript**

The manuscript must include 24 chapter sections:

```markdown
# Mưa Trên Bến Không Đèn

## Chương 1: [Title]
...
## Chương 24: [Title]
```

Expected: the story is complete end-to-end: inciting case, investigation, reversal, reveal, moral choice, and aftermath.

- [ ] **Step 2: Verify manuscript chapter count**

Run: `rg "^## Chương " docs/kiem-hiep/manuscript/draft-zero.md | wc -l`

Expected: `24`.

- [ ] **Step 3: Verify no unfinished-marker text remains**

Run: `rg "TBD|TODO|FIXME|điền|placeholder|chưa viết" docs/kiem-hiep`

Expected: no matches.

### Task 7: Create Index And Final Consistency Pass

**Files:**
- Create: `docs/kiem-hiep/00-index.md`

- [ ] **Step 1: Write index**

The index must link to the spec, plan, research modules, rulebook, story bible, outline, and manuscript.

- [ ] **Step 2: Run final file inventory**

Run: `find docs/kiem-hiep -type f | sort`

Expected: index, six research files, rulebook, story bible, outline, and manuscript are present.

- [ ] **Step 3: Scan for disallowed direct borrowing**

Run: `rg "Thiếu Lâm|Võ Đang|Cái Bang|Minh Giáo|Hoa Sơn|Đoàn Dự|Kiều Phong|Dương Quá|Tiểu Long Nữ|Lý Tầm Hoan|Sở Lưu Hương|Lục Tiểu Phụng" docs/kiem-hiep`

Expected: no matches.

- [ ] **Step 4: Review git status**

Run: `git status --short`

Expected: changed spec plus new docs under `docs/kiem-hiep/` and the plan file.

## Self-Review

- Spec coverage: Tasks 2-6 cover the research modules, rulebook, original story outline, and complete story package required by the spec.
- Unfinished-marker scan: The output files should contain no unfinished-marker text.
- Scope note: The manuscript is a compact draft-zero, not a polished final literary edition. It completes the full plot and character arc so later passes can expand style, sensory detail, and chapter length.
