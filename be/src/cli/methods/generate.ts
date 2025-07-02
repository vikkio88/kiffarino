import fs from "node:fs";
import path from "node:path";
import {
  ARCHIVED_TICKETS_FOLDER,
  DOCS_SUBFOLDER,
  PROJECT_CONFIG_FILENAME,
  LOCAL_ASSETS_FOLDER,
  TICKETS_FOLDER,
} from "@kiffarino/shared/config";
import { loadConfig, type ProjectConfig } from "../../libs/config";
import { migrate } from "../../db";
import { save } from "../../db/tickets";
import { createTicket } from "../../libs/factories";
import { C } from "../../libs/colours";

export function generate(args: string[]) {
  const force = args.includes("-f") || args.includes("--force");
  let config: ProjectConfig;
  try {
    config = loadConfig();
  } catch (err) {
    console.error(
      `${C.cR("❌ Failed to parse")} ${C.b(PROJECT_CONFIG_FILENAME)} ${C.cR(
        "config file."
      )}`
    );
    process.exit(1);
  }

  const projectRoot = path.resolve(".", config.baseFolder);
  if (fs.existsSync(projectRoot) && !force) {
    console.error(
      `${C.cR("❌ Project folder")} '${C.b(config.baseFolder)}' ${C.cR(
        "already exists."
      )} ${C.i("Use --force to delete and restart.")}`
    );
    process.exit(1);
  }

  if (fs.existsSync(projectRoot) && force) {
    fs.rmSync(projectRoot, { recursive: true, force: true });
    console.log(
      `${C.cP("⚠️ Overwriting existing folder")} '${C.b(
        config.baseFolder
      )}' ${C.cP("due to -f flag.")}`
    );
  }

  fs.mkdirSync(projectRoot, { recursive: true });

  console.log(C.cG("📦 Creating database..."));
  migrate();

  const ticketsDir = path.join(projectRoot, TICKETS_FOLDER);
  fs.mkdirSync(ticketsDir);

  const backlogTicket = createTicket("Backlog test ticket", {
    body: `This is your first backlog ticket inside ${config.baseFolder}/tickets.\n`,
    tagsString: "example,",
  });
  save(backlogTicket);

  const todoTicket = createTicket("Todo test ticket", {
    body: `This is your first TODO ticket, and it is a bug.\n`,
    status: "todo",
    type: "bug",
  });
  save(todoTicket);

  // Archived tickets dir
  const archivedDir = path.join(projectRoot, ARCHIVED_TICKETS_FOLDER);
  fs.mkdirSync(archivedDir);

  // Images/Static Assets
  const assetsDir = path.join(projectRoot, LOCAL_ASSETS_FOLDER);
  fs.mkdirSync(assetsDir);

  const docsDir = path.join(projectRoot, DOCS_SUBFOLDER);
  fs.mkdirSync(docsDir);
  const testDocPath = path.join(docsDir, "firstDoc.md");
  fs.writeFileSync(
    testDocPath,
    `This is your first document inside ${config.baseFolder}/docs.\n`
  );

  console.log(
    `${C.cG("✅ Project folders created at")} ${C.b(config.baseFolder)}`
  );
}
