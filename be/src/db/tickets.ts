import {
  PROJECT_CONFIG_FILENAME,
  TICKETS_SUBFOLDER,
} from "@kiffarino/shared/config";
import type { Ticket } from "@kiffarino/shared/models";

import fs from "node:fs";
import path from "node:path";
import { loadConfig, type ProjectConfig } from "../libs/config";
import db from ".";

export type TicketRecord = {
  id: string;
  title: string;
  status: string;
  priority: number;
  createdAt: number | null;
  updatedAt: number | null;
  filename: string;
};

export function toRecord(ticket: Ticket): TicketRecord {
  return {
    id: ticket.id,
    title: ticket.title,
    status: ticket.meta.status,
    priority: ticket.meta.priority,
    createdAt: ticket.createdAt || Date.now(),
    updatedAt: ticket.updatedAt || Date.now(),
    filename: ticket.filename,
  };
}

export async function save(ticket: Ticket) {
  let config: ProjectConfig;
  try {
    config = loadConfig();
  } catch (err) {
    console.error(`Failed to parse ${PROJECT_CONFIG_FILENAME} config file.`);
    return false;
  }

  await db().read();
  db().data!.tickets.push(toRecord(ticket));
  await db().write();

  const basePath = config.baseFolder;
  try {
    fs.writeFileSync(
      path.join(".", basePath, TICKETS_SUBFOLDER, ticket.filename),
      ticket.toMarkdown()
    );
    return true;
  } catch (err) {
    console.error(`Failed to save ${ticket.filename}`);
    return false;
  }
}
