import fs from "node:fs";
import path from "node:path";
import {
  DOCS_SUBFOLDER,
  PROJECT_CONFIG_FILENAME,
  TICKETS_SUBFOLDER,
} from "@kiffarino/shared/config";
import { loadConfig, type ProjectConfig } from "../../libs/config";
import { Ticket } from "@kiffarino/shared";
import { migrate } from "../../db";
import { save } from "../../db/tickets";
import { createTicket } from "../../libs/factories";

export function generate(args: string[]) {
  const force = args.includes("-f") || args.includes("--force");
  let config: ProjectConfig;
  try {
    config = loadConfig();
  } catch (err) {
    console.error(`❌ Failed to parse ${PROJECT_CONFIG_FILENAME} config file.`);
    process.exit(1);
  }

  const projectRoot = path.resolve(".", config.baseFolder);
  if (fs.existsSync(projectRoot) && !force) {
    console.error(
      `❌ Project folder '${config.baseFolder}' already exists. Use --force to delete and restart.`
    );
    process.exit(1);
  }

  if (fs.existsSync(projectRoot) && force) {
    fs.rmSync(projectRoot, { recursive: true, force: true });
    console.error(
      `Project folder '${config.baseFolder}' already exists, but "-f" flag was passed, removing existing folder.`
    );
  }

  fs.mkdirSync(projectRoot, { recursive: true });
  // creating the db
  migrate();

  const ticketsDir = path.join(projectRoot, TICKETS_SUBFOLDER);
  fs.mkdirSync(ticketsDir);

  // adding a test ticket
  const testTicket = createTicket("Test Ticket", {
    body: `This is your first ticket inside ${config.baseFolder}/tickets.\n`,
  });
  save(testTicket);

  const docsDir = path.join(projectRoot, DOCS_SUBFOLDER);
  fs.mkdirSync(docsDir);
  const testDocPath = path.join(docsDir, "firstDoc.md");
  fs.writeFileSync(
    testDocPath,
    `This is your first document inside ${config.baseFolder}/docs.\n`
  );

  console.log(`✅ Project folders created at ${config.baseFolder}`);
}
