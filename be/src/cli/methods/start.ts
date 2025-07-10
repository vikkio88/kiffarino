import fs from "node:fs";
import path from "node:path";
import { loadConfig } from "../../libs/config";
import { startServer } from "../../server";
import { EXEC_NAME } from "@kiffarino/shared/config";

export function start(args: string[]) {
  const config = loadConfig();
  const projectRoot = path.resolve(".", config.baseFolder);
  if (!fs.existsSync(projectRoot)) {
    console.error(
      `❌ No ${projectRoot} folder structure found. Run \`${EXEC_NAME} generate\` first.`
    );
    process.exit(1);
  }
  const forcedPort = args[0] ? parseInt(args[0]) : undefined;
  startServer(forcedPort);
}
