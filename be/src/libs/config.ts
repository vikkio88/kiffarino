import { EXEC_NAME, PROJECT_CONFIG_FILENAME } from "@kiffarino/shared/config";
import type { Ticket } from "@kiffarino/shared/models";

import fs from "node:fs";
import path from "node:path";

export type ProjectConfig = {
  name: string;
  baseFolder: string;
};

let config: ProjectConfig;

export function loadConfig() {
  if (config) return config;
  const configPath = path.resolve(".", PROJECT_CONFIG_FILENAME);

  if (!fs.existsSync(configPath)) {
    console.error(
      `❌ No ${PROJECT_CONFIG_FILENAME} file found. Run \`${EXEC_NAME} init\` first.`
    );
    process.exit(1);
  }

  const raw = fs.readFileSync(configPath, "utf-8");

  config = JSON.parse(raw);

  return config;
}
