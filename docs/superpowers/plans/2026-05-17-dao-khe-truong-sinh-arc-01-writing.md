# Đạo Khế Trường Sinh Arc 1 Writing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce the complete first arc of `Đạo Khế Trường Sinh`: 18 chapters covering Lâm Thất's recruitment, arrival at Linh Khê Tông, first three months of outer sect survival, and the first active clue about Lâm Trường An.

**Architecture:** Treat the novel like a content system with a story bible, arc outline, chapter briefs, chapter manuscripts, and a combined final manuscript. Each chapter must be written from the same ruleset and checked against continuity before moving to the next batch.

**Tech Stack:** Markdown files, Git commits, `rg`, `wc`, manual prose review, continuity checklist.

---

## File Structure

- Create: `docs/dao-khe-truong-sinh/00-index.md`
  - Entry point for the new novel docs.
- Create: `docs/dao-khe-truong-sinh/story-bible.md`
  - Canon for premise, characters, sect, artifact, cultivation, and tone.
- Create: `docs/dao-khe-truong-sinh/rules.md`
  - Writing rules and chapter acceptance checklist.
- Create: `docs/dao-khe-truong-sinh/outline-arc-01.md`
  - 18-chapter detailed outline for Arc 1.
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/`
  - One Markdown file per chapter.
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01.md`
  - Combined final Arc 1 manuscript assembled from chapter files.

## Quality Targets

- Arc 1 target length: 18 chapters.
- Chapter target length: 2,400-3,200 Vietnamese words per chapter.
- Arc 1 total target: about 43,000-57,000 Vietnamese words.
- Each chapter opens with concrete pressure.
- Each chapter closes by changing the meaning of an earlier detail.
- The Sổ Nợ Vô Danh gives information, not direct solutions.
- Lâm Thất wins through observation, tradeoff, and restraint.
- Tạ Thanh Nghi must have institutional loyalty and personal agency.
- Lục Hoài Chân must remain persuasive, not cartoonishly evil.

## Task 1: Create Novel Bible And Writing Rules

**Files:**
- Create: `docs/dao-khe-truong-sinh/00-index.md`
- Create: `docs/dao-khe-truong-sinh/story-bible.md`
- Create: `docs/dao-khe-truong-sinh/rules.md`

- [ ] **Step 1: Create the novel index**

Write `docs/dao-khe-truong-sinh/00-index.md` with this structure:

```markdown
# Đạo Khế Trường Sinh

## Documents

- [Story Bible](story-bible.md)
- [Writing Rules](rules.md)
- [Arc 1 Outline](outline-arc-01.md)
- [Arc 1 Manuscript](manuscript/arc-01.md)

## Current Scope

Arc 1: `Ba Tháng Ngoại Môn`, 18 chapters.
```

- [ ] **Step 2: Create the story bible**

Write `docs/dao-khe-truong-sinh/story-bible.md` using the approved design spec as canon. Include these exact sections:

```markdown
# Hồ sơ truyện: Đạo Khế Trường Sinh

## Logline

Lâm Thất, một thiếu niên phàm thôn thực dụng, bị tuyển vào Linh Khê Tông để cứu gia đình khỏi khế nợ nhập đạo và tìm anh trai mất tích. Khi Sổ Nợ Vô Danh trong hòm đồ cũ của anh trai thức tỉnh, hắn phát hiện tu tiên không phải ân ban, mà là một khoản nợ trời đất có thể bị người mạnh bắt người yếu trả thay.

## Luận đề

Trường sinh không miễn phí. Vấn đề không phải tu tiên có giá hay không, mà là ai được quyền bắt người khác trả giá thay mình.

## Tông truyện

Tiên hiệp chính thống, hắc ám nhẹ. Thế giới có cạnh tranh, giả dối, bóc lột và người chết, nhưng vẫn còn ân nghĩa, lựa chọn tử tế và ranh giới đạo đức.

## Nhân vật chính

Lâm Thất là người thường cực kỳ thực dụng. Hắn không phải thiên tài, không phải phế vật nhặt được bảo vật nghịch thiên, và không có chí lớn từ đầu.

Động lực ban đầu:

- Trả khế cứu gia đình.
- Tìm sự thật về Lâm Trường An.

Ranh giới:

- Không phản bội người thật sự cứu mình.
- Không giết người vô ích.
- Không lấy đại đạo làm cớ cho mọi tội ác.

## Sổ Nợ Vô Danh

Sổ đen không tên, nằm trong hòm đồ cũ của Lâm Trường An. Sổ nhìn thấy một phần các món nợ: linh khí, sinh mạng, lời thề, công pháp, tông môn, huyết mạch, nhân quả.

Sổ không tăng tu vi trực tiếp. Mỗi lần dùng sổ để đổi cục diện, Lâm Thất cũng bị ghi thêm nợ.

## Hệ thống tu luyện

Khung cảnh giới:

```text
Luyện Khí -> Trúc Cơ -> Kim Đan -> Nguyên Anh -> Hóa Thần
```

Bản chất:

- Luyện Khí: vay khí nhập thân.
- Trúc Cơ: lấy đạo cơ làm vật thế chấp.
- Kim Đan: ký đại khế với trời đất.
- Nguyên Anh: tách một phần bản ngã thành chủ nợ nội tâm.
- Hóa Thần: nợ kéo theo tông môn, huyết mạch và nhân quả.

## Linh Khê Tông

Tông môn từng tốt nhưng đang suy tàn. Linh mạch cạn, linh điền bạc màu, đệ tử giỏi rời đi, tầng chấp sự siết khế để giữ tông môn sống sót.

## Nhân vật trung tâm Arc 1

- Lâm Thất: người nhập môn mới, quan sát và tính toán.
- Lâm Trường An: anh trai mất tích, còn sống trong bí mật.
- Tạ Thanh Nghi: con gái chấp sự quản khế, giám sát đệ tử mới.
- Lục Hoài Chân: trưởng lão tuyển linh căn, ôn hòa và nguy hiểm.

## Bí mật dài hạn

Lâm Trường An không bế quan. Anh bị đưa vào Khê Tâm Động làm người giữ mạch. Sổ Nợ Vô Danh liên quan đến một thiên khế cổ.
```

- [ ] **Step 3: Create writing rules**

Write `docs/dao-khe-truong-sinh/rules.md` with this checklist:

```markdown
# Bộ quy tắc sáng tác: Đạo Khế Trường Sinh

## Mở chương

Mỗi chương mở bằng áp lực cụ thể: khế đến hạn, tuyển linh căn, nợ bị siết, nhiệm vụ nguy hiểm, người mất tích, cáo buộc, thân thể trả giá, hoặc một chi tiết trái với lời tông môn nói.

## Đóng chương

Dòng cuối phải làm độc giả hiểu lại một chi tiết trước đó. Không đóng bằng câu hỏi trống.

## Sổ Nợ Vô Danh

Sổ chỉ cho dữ kiện, không cho lời giải. Mỗi lần Sổ giúp Lâm Thất đổi cục diện, phải có cái giá hoặc một dòng nợ mới.

## Lâm Thất

Lâm Thất thắng bằng quan sát, kiên nhẫn, tính toán và chọn mất ít hơn. Không cho hắn thắng vì may mắn liên tục hoặc vì người khác tự nhiên ngu đi.

## Tu luyện

Mỗi tài nguyên, công pháp, đan dược, nhiệm vụ hoặc đột phá đều phải có giá. Giá có thể là linh thạch, thời gian, thân thể, đạo cơ, nợ tông môn, lời thề hoặc nhân quả.

## Hắc ám nhẹ

Có bóc lột và người chết, nhưng không biến toàn bộ thế giới thành ác nhân một màu. Ít nhất trong mỗi arc phải có người chọn giữ một phần đạo nghĩa dù bất lợi.

## Tạ Thanh Nghi

Nàng có mục tiêu, niềm tin và rủi ro riêng. Nàng không được luôn đồng ý với Lâm Thất.

## Lục Hoài Chân

Ông ta nguy hiểm vì hợp lý, không phải vì điên ác. Lời của ông phải có sức thuyết phục với phàm nhân và một phần đệ tử.

## Kiểm tra trước khi chốt chương

- Chương mở bằng áp lực cụ thể chưa?
- Chương có ít nhất một giao dịch, món nợ, lời hứa, hoặc cái giá không?
- Lâm Thất có phải trả giá cho thông tin hoặc lợi thế không?
- Sổ Nợ có đang giải quyết quá dễ không?
- Tạ Thanh Nghi hoặc nhân vật phụ có mục tiêu riêng không?
- Dòng cuối có làm đổi nghĩa chi tiết trước đó không?
- Có đoạn nào giảng hệ thống quá dài không?
```

- [ ] **Step 4: Verify rules files**

Run:

```bash
rg -n "T[B]D|PLACE[H]OLDER" docs/dao-khe-truong-sinh
```

Expected: no matches.

- [ ] **Step 5: Commit Task 1**

```bash
git add docs/dao-khe-truong-sinh/00-index.md docs/dao-khe-truong-sinh/story-bible.md docs/dao-khe-truong-sinh/rules.md
git commit -m "Add Dao Khe Truong Sinh story bible"
```

## Task 2: Create Detailed Arc 1 Outline

**Files:**
- Create: `docs/dao-khe-truong-sinh/outline-arc-01.md`

- [ ] **Step 1: Write the 18-chapter outline**

Write `docs/dao-khe-truong-sinh/outline-arc-01.md` with one section per chapter. Each section must include:

- Opening pressure.
- Main event.
- Debt or contract element.
- Character movement.
- Closing reversal.

Use these chapter titles:

```markdown
# Arc 1: Ba Tháng Ngoại Môn

## Chương 01: Hòm Cũ Trước Ngày Tuyển Linh
## Chương 02: Tiên Nhân Đọc Khế
## Chương 03: Sổ Đen Hiện Chữ
## Chương 04: Một Đời Phàm Thân
## Chương 05: Rời Thôn Không Nợ Ít Hơn
## Chương 06: Cổng Núi Linh Khê
## Chương 07: Cơm Áo Ngoại Môn Đều Tính Lãi
## Chương 08: Tạ Thanh Nghi Kiểm Khế
## Chương 09: Việc Thấp Giá Cao
## Chương 10: Công Pháp Có Lãi
## Chương 11: Nhiệm Vụ Ngoài Rìa Linh Điền
## Chương 12: Dòng Nợ Đầu Tiên Của Lâm Thất
## Chương 13: Lục Trưởng Lão Hỏi Chuyện Người Cũ
## Chương 14: Người Giữ Khế Bắt Gặp Người Giấu Khế
## Chương 15: Bẫy Khế Đóng Lại
## Chương 16: Cứu Một Người, Bỏ Một Người
## Chương 17: Lá Thư Hoãn Nợ Về Nhà
## Chương 18: Nợ Của Lâm Trường An Vẫn Còn Sống
```

- [ ] **Step 2: Verify every chapter has all fields**

Run:

```bash
rg -n "^## Chương|Opening pressure|Main event|Debt or contract element|Character movement|Closing reversal" docs/dao-khe-truong-sinh/outline-arc-01.md
```

Expected: 18 chapter headings and 90 field labels.

- [ ] **Step 3: Commit Task 2**

```bash
git add docs/dao-khe-truong-sinh/outline-arc-01.md
git commit -m "Add Dao Khe Truong Sinh arc 1 outline"
```

## Task 3: Write Chapters 1-3

**Files:**
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-01-hom-cu-truoc-ngay-tuyen-linh.md`
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-02-tien-nhan-doc-khe.md`
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-03-so-den-hien-chu.md`

- [ ] **Step 1: Write Chapter 1**

Write 2,400-3,200 Vietnamese words. Required beats:

- Open with the family forced to open Lâm Trường An's old chest because recruitment is tomorrow and the village clerk needs proof of old sect favor.
- Establish Lâm Thất's practical eye through objects, not exposition.
- Show parents clinging to hope about Lâm Trường An.
- Introduce the black nameless ledger as an apparently blank object.
- End by making the chest feel less like a keepsake and more like a debt record.

- [ ] **Step 2: Write Chapter 2**

Write 2,400-3,200 Vietnamese words. Required beats:

- Open with Lục Hoài Chân arriving before the village is ready.
- Show his gentleness and authority.
- Present the recruitment as blessing in speech and contract in writing.
- Let Lâm Thất notice fees charged even to families whose children are not chosen.
- End with Lục Hoài Chân recognizing the Lâm surname before Lâm Thất mentions his brother.

- [ ] **Step 3: Write Chapter 3**

Write 2,400-3,200 Vietnamese words. Required beats:

- Open with the first spiritual-root test putting immediate pressure on Lâm Thất's family.
- Lâm Thất's root is usable but ordinary.
- The ledger awakens during the contract reading.
- Display the first ledger text exactly:

```text
Khế nhập đạo đã lập.
Người vay: Lâm Thất.
Nợ gốc: một đời phàm thân.
Lãi: chưa định.
```

- End with Lâm Thất realizing the ledger is not recording what he owns, but what has begun to own him.

- [ ] **Step 4: Verify Chapters 1-3**

Run:

```bash
wc -w docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-0{1,2,3}-*.md
rg -n "Khế nhập đạo đã lập|Người vay: Lâm Thất|Nợ gốc: một đời phàm thân|Lãi: chưa định" docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-03-so-den-hien-chu.md
```

Expected:

- Each chapter is within 2,400-3,200 words by `wc -w` approximation.
- Chapter 3 contains all four required ledger lines.

- [ ] **Step 5: Commit Task 3**

```bash
git add docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-01-hom-cu-truoc-ngay-tuyen-linh.md docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-02-tien-nhan-doc-khe.md docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-03-so-den-hien-chu.md
git commit -m "Write Dao Khe Truong Sinh chapters 1 to 3"
```

## Task 4: Write Chapters 4-6

**Files:**
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-04-mot-doi-pham-than.md`
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-05-roi-thon-khong-no-it-hon.md`
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-06-cong-nui-linh-khe.md`

- [ ] **Step 1: Write Chapter 4**

Required beats:

- Lâm Thất understands that refusing recruitment does not free his family.
- The contract language makes the family responsible for testing fees, travel fees, and old favor debt.
- He signs for practical reasons, not heroic impulse.
- End with the signature looking less like a name and more like a price.

- [ ] **Step 2: Write Chapter 5**

Required beats:

- The selected children leave the village.
- Show contrasting reactions: pride, fear, envy, resentment.
- Lâm Thất notices that every gift from the sect is recorded.
- Include one small act of kindness that prevents the world from feeling uniformly cruel.
- End with Lâm Thất realizing the road away from home has already been charged to him.

- [ ] **Step 3: Write Chapter 6**

Required beats:

- First view of Linh Khê Tông should be beautiful but visibly strained.
- The spiritual stream is impressive to mortals but weak to cultivators.
- New disciples register at the gate.
- Lâm Thất sees that the gate plaque and registration tablets carry old unpaid debt.
- End with the sect looking less like paradise and more like a ledger made of stone.

- [ ] **Step 4: Verify Chapters 4-6**

Run:

```bash
wc -w docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-0{4,5,6}-*.md
rg -n "Lâm Thất|Linh Khê|khế|nợ" docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-0{4,5,6}-*.md
```

Expected: each chapter has target length and uses the core terms in context.

- [ ] **Step 5: Commit Task 4**

```bash
git add docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-04-mot-doi-pham-than.md docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-05-roi-thon-khong-no-it-hon.md docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-06-cong-nui-linh-khe.md
git commit -m "Write Dao Khe Truong Sinh chapters 4 to 6"
```

## Task 5: Write Chapters 7-9

**Files:**
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-07-com-ao-ngoai-mon-deu-tinh-lai.md`
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-08-ta-thanh-nghi-kiem-khe.md`
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-09-viec-thap-gia-cao.md`

- [ ] **Step 1: Write Chapter 7**

Required beats:

- Outer sect housing and food are assigned.
- New disciples learn that bedding, rice, lamp oil, and basic robes are not free.
- Lâm Thất chooses the worse room to reduce debt.
- End with another disciple choosing comfort and unknowingly signing heavier interest.

- [ ] **Step 2: Write Chapter 8**

Required beats:

- Tạ Thanh Nghi audits new disciple contracts.
- She is precise, not cruel.
- She catches an error others missed and corrects it even though it benefits a poor disciple.
- Lâm Thất distrusts her because she still defends the system.
- End with Tạ Thanh Nghi noticing that Lâm Thất reads contract margins before main clauses.

- [ ] **Step 3: Write Chapter 9**

Required beats:

- Lâm Thất selects a low-status task no one wants.
- The task looks cheap but has a hidden advantage.
- He finds a loophole that lets him earn a small credit without taking extra debt.
- End with the task ledger showing a name connected to Lâm Trường An.

- [ ] **Step 4: Verify Chapters 7-9**

Run:

```bash
wc -w docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-0{7,8,9}-*.md
rg -n "Tạ Thanh Nghi|Lâm Trường An|ngoại môn|khế" docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-0{7,8,9}-*.md
```

Expected: target length and required names/terms appear.

- [ ] **Step 5: Commit Task 5**

```bash
git add docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-07-com-ao-ngoai-mon-deu-tinh-lai.md docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-08-ta-thanh-nghi-kiem-khe.md docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-09-viec-thap-gia-cao.md
git commit -m "Write Dao Khe Truong Sinh chapters 7 to 9"
```

## Task 6: Write Chapters 10-12

**Files:**
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-10-cong-phap-co-lai.md`
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-11-nhiem-vu-ngoai-ria-linh-dien.md`
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-12-dong-no-dau-tien-cua-lam-that.md`

- [ ] **Step 1: Write Chapter 10**

Required beats:

- New disciples choose basic cultivation methods.
- A better method is offered with attractive language and hidden repayment.
- Lâm Thất picks a modest method because the Sổ Nợ shows lighter interest.
- End with a talented disciple signing for power too early.

- [ ] **Step 2: Write Chapter 11**

Required beats:

- First mission near the edge of spiritual fields.
- The mission is physically unpleasant, not glorious.
- Lâm Thất learns how spiritual fields consume labor and debt.
- A minor danger forces him to choose between reward and safety.
- End with the field reacting to the ledger.

- [ ] **Step 3: Write Chapter 12**

Required beats:

- Lâm Thất uses the Sổ Nợ to change a mission outcome.
- The Sổ writes the first unclear personal debt line against him.
- He wins a small advantage but becomes afraid of relying on the artifact.
- End with the new debt line remaining visible after the page should have gone blank.

- [ ] **Step 4: Verify Chapters 10-12**

Run:

```bash
wc -w docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-{10,11,12}-*.md
rg -n "Sổ Nợ|công pháp|linh điền|Lâm Thất" docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-{10,11,12}-*.md
```

Expected: target length and required motif terms appear.

- [ ] **Step 5: Commit Task 6**

```bash
git add docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-10-cong-phap-co-lai.md docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-11-nhiem-vu-ngoai-ria-linh-dien.md docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-12-dong-no-dau-tien-cua-lam-that.md
git commit -m "Write Dao Khe Truong Sinh chapters 10 to 12"
```

## Task 7: Write Chapters 13-15

**Files:**
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-13-luc-truong-lao-hoi-chuyen-nguoi-cu.md`
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-14-nguoi-giu-khe-bat-gap-nguoi-giau-khe.md`
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-15-bay-khe-dong-lai.md`

- [ ] **Step 1: Write Chapter 13**

Required beats:

- Lục Hoài Chân asks about Lâm Trường An in a calm private exchange.
- He gives plausible comfort while avoiding direct answers.
- Lâm Thất notices the avoidance but cannot challenge him.
- End with Lục Hoài Chân using a phrase that also appears in old letters about Lâm Trường An.

- [ ] **Step 2: Write Chapter 14**

Required beats:

- Tạ Thanh Nghi catches Lâm Thất comparing contract copies or margins.
- Their conflict is intellectual rather than romantic.
- She warns him that contract violations can harm his family.
- He points out a clause she cannot easily defend.
- End with her checking an archive she previously trusted.

- [ ] **Step 3: Write Chapter 15**

Required beats:

- The first serious contract trap closes around several new disciples.
- The trap should be legal under sect rules but morally wrong.
- Lâm Thất sees a way out that cannot save everyone.
- End with him realizing the cost of choosing only after the deadline falls.

- [ ] **Step 4: Verify Chapters 13-15**

Run:

```bash
wc -w docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-{13,14,15}-*.md
rg -n "Lục Hoài Chân|Tạ Thanh Nghi|Lâm Trường An|khế" docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-{13,14,15}-*.md
```

Expected: target length and required character terms appear.

- [ ] **Step 5: Commit Task 7**

```bash
git add docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-13-luc-truong-lao-hoi-chuyen-nguoi-cu.md docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-14-nguoi-giu-khe-bat-gap-nguoi-giau-khe.md docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-15-bay-khe-dong-lai.md
git commit -m "Write Dao Khe Truong Sinh chapters 13 to 15"
```

## Task 8: Write Chapters 16-18

**Files:**
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-16-cuu-mot-nguoi-bo-mot-nguoi.md`
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-17-la-thu-hoan-no-ve-nha.md`
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-18-no-cua-lam-truong-an-van-con-song.md`

- [ ] **Step 1: Write Chapter 16**

Required beats:

- Lâm Thất acts under time pressure.
- He saves himself and one other disciple by exploiting a lawful loophole.
- Someone else suffers because he cannot widen the loophole.
- He does not celebrate the win.
- End with the saved person owing him in a way he did not ask for.

- [ ] **Step 2: Write Chapter 17**

Required beats:

- Lâm Thất sends a repayment or delay notice home.
- The letter must reveal what he chooses not to tell his parents.
- Tạ Thanh Nghi sees one consequence of the system she serves.
- End with the outgoing mail record showing a prior message from Lâm Trường An that never reached home.

- [ ] **Step 3: Write Chapter 18**

Required beats:

- Lâm Thất investigates the old mail or debt record.
- The ledger reveals that Lâm Trường An's debt is still active under Linh Khê.
- The phrase `Khê Tâm Động` appears for the first time as a location or debt source.
- Arc ends with Lâm Thất surviving three months but gaining a larger fear: his brother is not dead, and that may be worse.

- [ ] **Step 4: Verify Chapters 16-18**

Run:

```bash
wc -w docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-{16,17,18}-*.md
rg -n "Khê Tâm Động|Lâm Trường An|ba tháng|nợ" docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-{16,17,18}-*.md
```

Expected: target length and final arc terms appear.

- [ ] **Step 5: Commit Task 8**

```bash
git add docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-16-cuu-mot-nguoi-bo-mot-nguoi.md docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-17-la-thu-hoan-no-ve-nha.md docs/dao-khe-truong-sinh/manuscript/arc-01/chuong-18-no-cua-lam-truong-an-van-con-song.md
git commit -m "Write Dao Khe Truong Sinh chapters 16 to 18"
```

## Task 9: Assemble And Final Review Arc 1

**Files:**
- Create: `docs/dao-khe-truong-sinh/manuscript/arc-01.md`
- Modify: `docs/dao-khe-truong-sinh/00-index.md`

- [ ] **Step 1: Assemble combined manuscript**

Create `docs/dao-khe-truong-sinh/manuscript/arc-01.md` by concatenating chapters 1-18 in order. Start with:

```markdown
# Đạo Khế Trường Sinh

## Arc 1: Ba Tháng Ngoại Môn
```

Then include each chapter with its original `# Chương NN` heading.

- [ ] **Step 2: Verify chapter count**

Run:

```bash
rg -n "^# Chương" docs/dao-khe-truong-sinh/manuscript/arc-01.md
```

Expected: 18 matches.

- [ ] **Step 3: Verify motif and continuity**

Run:

```bash
rg -n "Lâm Thất|Lâm Trường An|Tạ Thanh Nghi|Lục Hoài Chân|Sổ Nợ Vô Danh|Khê Tâm Động" docs/dao-khe-truong-sinh/manuscript/arc-01.md
```

Expected: all six terms appear.

- [ ] **Step 4: Verify total length**

Run:

```bash
wc -w docs/dao-khe-truong-sinh/manuscript/arc-01.md
```

Expected: about 43,000-57,000 words by `wc -w` approximation. Vietnamese tokenization is imperfect, so use this as a consistency signal, not an exact literary word count.

- [ ] **Step 5: Run final prose checklist**

Manually check:

- Every chapter opens with concrete pressure.
- Every chapter closes with a reversal or reinterpretation.
- No chapter solves conflict through a free artifact answer.
- Lâm Thất pays for major advantages.
- Tạ Thanh Nghi's position changes gradually, not instantly.
- Lục Hoài Chân remains plausible.
- Chapter 18 opens Arc 2 by pointing toward Khê Tâm Động.

- [ ] **Step 6: Commit Task 9**

```bash
git add docs/dao-khe-truong-sinh/00-index.md docs/dao-khe-truong-sinh/manuscript/arc-01.md
git commit -m "Assemble Dao Khe Truong Sinh arc 1 manuscript"
```
