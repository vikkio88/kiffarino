import {
  PROJECT_CONFIG_FILENAME,
  TICKETS_SUBFOLDER,
} from "@kiffarino/shared/config";
import { Ticket, type TicketRecord } from "@kiffarino/shared/models";

import fs from "node:fs";
import path from "node:path";
import { loadConfig, type ProjectConfig } from "../libs/config";
import db from ".";

export const sort = {
  byUpdatedASC: (a: TicketRecord, b: TicketRecord) =>
    (a.updatedAt || 0) - (b.updatedAt || 0),

  byUpdatedDESC: (a: TicketRecord, b: TicketRecord) =>
    (b.updatedAt || 0) - (a.updatedAt || 0),

  byCreatedASC: (a: TicketRecord, b: TicketRecord) =>
    (a.createdAt || 0) - (b.createdAt || 0),

  byCreatedDESC: (a: TicketRecord, b: TicketRecord) =>
    (b.createdAt || 0) - (a.createdAt || 0),

  byPriorityASC: (a: TicketRecord, b: TicketRecord) =>
    (a.priority ?? 99) - (b.priority ?? 99),

  byPriorityDESC: (a: TicketRecord, b: TicketRecord) =>
    (b.priority ?? 0) - (a.priority ?? 0),
};

export function removeTicketFile(
  baseFolder: string,
  ticketsFolder: string,
  filename: string
): boolean {
  const ticketPath = path.join(".", baseFolder, ticketsFolder, filename);
  if (!fs.existsSync(ticketPath)) return true;
  try {
    fs.unlinkSync(ticketPath);
    return true;
  } catch (err) {
    console.error(`Error whilst removing file "${ticketPath}"`);
    return true;
  }
}
export function loadTicketFromFile(
  baseFolder: string,
  ticketsFolder: string,
  filename: string
): Ticket | undefined {
  const ticketPath = path.join(".", baseFolder, ticketsFolder, filename);
  if (!fs.existsSync(ticketPath)) {
    return undefined;
  }

  const md = fs.readFileSync(ticketPath).toString();
  return new Ticket(md, filename);
}

export async function save(ticket: Ticket, isUpdate = false) {
  let config: ProjectConfig;
  try {
    config = loadConfig();
  } catch (err) {
    console.error(`Failed to parse ${PROJECT_CONFIG_FILENAME} config file.`);
    return false;
  }

  await db().read();
  if (!isUpdate) {
    db().data!.tickets.push(ticket.toRecord());
  } else {
    db().data!.tickets = [
      ...db().data!.tickets.filter((t) => t.id !== ticket.id),
      ticket.toRecord(),
    ];
  }
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
