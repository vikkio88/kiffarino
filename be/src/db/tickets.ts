import { PROJECT_CONFIG_FILENAME } from "@kiffarino/shared/config";
import type { Ticket } from "@kiffarino/shared/models";

import fs from "node:fs";
import path from "node:path";
import { loadConfig, type ProjectConfig } from "../libs/config";

export function save(ticket: Ticket): boolean {
  let config: ProjectConfig;
  try {
    config = loadConfig();
  } catch (err) {
    console.error(`Failed to parse ${PROJECT_CONFIG_FILENAME} config file.`);
    return false;
  }

  const basePath = config.baseFolder;
  try {
    fs.writeFileSync(
      path.join(".", basePath, "tickets", ticket.filename),
      ticket.toMarkdown()
    );
    return true;
  } catch (err) {
    console.error(`Failed to save ${ticket.filename}`);
    return false;
  }
}
