# MyLENS documentation

**Start here** if you are a new **user** or a new **developer** taking over this project.

MyLENS is a youth tourism video campaign platform with:

- School and creator accounts
- Campaign video submissions
- Learning lessons and homework assignments
- Admin review tools

---

## Who should read what?

### I am a student creator

Read these in order:

1. [Getting started](user/00_getting_started.md)
2. [Creator guide](user/01_creator_guide.md)
3. [Troubleshooting](user/03_troubleshooting.md) — only when something goes wrong

Or open the PDF: [MyLENS_Creator_Guide.pdf](pdf/MyLENS_Creator_Guide.pdf)

### I am a MyLENS admin / mentor

Read these in order:

1. [Getting started](user/00_getting_started.md)
2. [Admin guide](user/02_admin_guide.md)
3. [Creator guide](user/01_creator_guide.md) — useful so you know what students see
4. [Troubleshooting](user/03_troubleshooting.md)

Or open the PDF: [MyLENS_Admin_Guide.pdf](pdf/MyLENS_Admin_Guide.pdf)

### I want one full user PDF

Open: [MyLENS_User_Manual.pdf](pdf/MyLENS_User_Manual.pdf)

### I am a new developer

Read these in order:

1. [Project overview](developer/00_overview.md)
2. [Setup and run](developer/01_setup_and_run.md)
3. [Supabase and database](developer/02_supabase_and_database.md)
4. [Architecture](developer/03_architecture.md)
5. [Features and key files](developer/04_features_and_key_files.md)
6. [Deploy and auth](developer/05_deploy_and_auth.md)
7. [Handover checklist](developer/06_handover_checklist.md)

Also skim the **user** guides so you understand the product.

Or open the PDF: [MyLENS_Developer_Handover.pdf](pdf/MyLENS_Developer_Handover.pdf)

---

## Folder map

```text
(UserManual & Guide)/
  README.md              ← you are here
  user/                  ← editable User Manual chapters
  developer/             ← editable Developer Handover chapters
  scripts/               ← builds PDFs from Markdown
  pdf/                   ← finished PDFs to share or print
```

Markdown chapters are the **source of truth**.  
Do not edit the PDF files directly. Rebuild them after changing Markdown.

---

## Refresh the PDFs after editing

From the **mylens-2026** project root, run:

```bash
node "(UserManual & Guide)/scripts/build-pdf-manuals.mjs"
```

---

## Important reminder (read this once)

MyLENS has **two different kinds of work**:

| Name on screen | What it is |
|----------------|------------|
| **Submissions** | Tourism contest video |
| **My tasks** / **Assignments** / **Reviews** | Learning homework for mentors |

Do not look for homework inside Submissions.  
Do not look for contest videos inside Learning Reviews.
