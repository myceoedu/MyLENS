# Finished PDF manuals

This folder contains finished PDFs to share, print, or email.

| File | Audience |
|------|----------|
| [MyLENS_Creator_Guide.pdf](MyLENS_Creator_Guide.pdf) | Student creators |
| [MyLENS_Admin_Guide.pdf](MyLENS_Admin_Guide.pdf) | Admins and mentors |
| [MyLENS_User_Manual.pdf](MyLENS_User_Manual.pdf) | Full combined user manual |
| [MyLENS_Developer_Handover.pdf](MyLENS_Developer_Handover.pdf) | New developers |

Do not edit PDF files directly.

## Update a manual

1. Edit the Markdown chapters in `../user/` or `../developer/`
2. From the **mylens-2026** project root, rebuild:

```bash
node "(UserManual & Guide)/scripts/build-pdf-manuals.mjs"
```
