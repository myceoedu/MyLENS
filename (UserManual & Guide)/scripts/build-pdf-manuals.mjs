import {
  copyFileSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { execSync } from "node:child_process";

const docsDirectory = resolve(import.meta.dirname, "..");
const pdfDirectory = join(docsDirectory, "pdf");
const temporaryDirectory = mkdtempSync(join(tmpdir(), "mylens-manuals-"));

const manuals = [
  {
    fileName: "MyLENS_Creator_Guide.pdf",
    title:
      "# MyLENS — Creator Guide\n\n**For student creators**  \nEnglish · Easy to follow",
    sourceFiles: [
      "user/00_getting_started.md",
      "user/01_creator_guide.md",
      "user/03_troubleshooting.md",
    ],
  },
  {
    fileName: "MyLENS_Admin_Guide.pdf",
    title:
      "# MyLENS — Admin Guide\n\n**For admins and mentors**  \nEnglish · Easy to follow",
    sourceFiles: [
      "user/00_getting_started.md",
      "user/02_admin_guide.md",
      "user/03_troubleshooting.md",
    ],
  },
  {
    fileName: "MyLENS_User_Manual.pdf",
    title:
      "# MyLENS — User Manual\n\n**For creators and administrators**  \nEnglish · Easy to follow",
    sourceFiles: [
      "user/00_getting_started.md",
      "user/01_creator_guide.md",
      "user/02_admin_guide.md",
      "user/03_troubleshooting.md",
    ],
  },
  {
    fileName: "MyLENS_Developer_Handover.pdf",
    title:
      "# MyLENS — Developer Handover Guide\n\n**For engineers taking over this project**  \nEnglish · Easy to follow",
    sourceFiles: [
      "developer/00_overview.md",
      "developer/01_setup_and_run.md",
      "developer/02_supabase_and_database.md",
      "developer/03_architecture.md",
      "developer/04_features_and_key_files.md",
      "developer/05_deploy_and_auth.md",
      "developer/06_handover_checklist.md",
    ],
  },
];

try {
  for (const manual of manuals) {
    const markdown = [
      manual.title,
      ...manual.sourceFiles.map((sourceFile) =>
        readFileSync(join(docsDirectory, sourceFile), "utf8").trim()
      ),
    ].join("\n\n---\n\n");

    const temporaryMarkdown = join(
      temporaryDirectory,
      basename(manual.fileName, ".pdf") + ".md"
    );
    const temporaryPdf = temporaryMarkdown.replace(/\.md$/, ".pdf");

    writeFileSync(temporaryMarkdown, `${markdown}\n`, "utf8");
    execSync(`npx --yes md-to-pdf "${temporaryMarkdown.replaceAll('"', '\\"')}"`, {
      cwd: docsDirectory,
      stdio: "inherit",
    });
    copyFileSync(temporaryPdf, join(pdfDirectory, manual.fileName));
    console.log(`Created pdf/${manual.fileName}`);
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
