import { EXEC_NAME, PROJECT_CONFIG_FILENAME } from "@kiffarino/shared/config";
import fs from "node:fs";
import path from "node:path";

export function generate() {
  const configPath = path.resolve(".", PROJECT_CONFIG_FILENAME);

  if (!fs.existsSync(configPath)) {
    console.error(
      `❌ No ${PROJECT_CONFIG_FILENAME} file found. Run \`${EXEC_NAME} init\` first.`
    );
    process.exit(1);
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  let config: { name: string; baseFolder: string };

  try {
    config = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Failed to parse ${PROJECT_CONFIG_FILENAME} config file.");
    process.exit(1);
  }

  const projectRoot = path.resolve(".", config.baseFolder);
  if (fs.existsSync(projectRoot)) {
    console.error(`❌ Project folder '${config.baseFolder}' already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(projectRoot, { recursive: true });
  const dbPath = path.join(projectRoot, "db.json");
  fs.writeFileSync(dbPath, JSON.stringify([], null, 2));

  const ticketsDir = path.join(projectRoot, "tickets");
  fs.mkdirSync(ticketsDir);

  const testTicketPath = path.join(ticketsDir, "testTicket.md");
  fs.writeFileSync(
    testTicketPath,
    `This is your first ticket inside ${config.baseFolder}/tickets.\n`
  );

  const docsDir = path.join(projectRoot, "docs");
  fs.mkdirSync(docsDir);
  const testDocPath = path.join(ticketsDir, "firstDoc.md");
  fs.writeFileSync(
    testTicketPath,
    `This is your first document inside ${config.baseFolder}/docs.\n`
  );

  console.log(`✅ Project folders created at ${config.baseFolder}`);
}
