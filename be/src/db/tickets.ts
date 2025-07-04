import {
  PROJECT_CONFIG_FILENAME,
  TICKETS_FOLDER,
} from "@kiffarino/shared/config";
import { Ticket, type TicketRecord } from "@kiffarino/shared/models";

import fs from "node:fs";
import path from "node:path";
import { loadConfig, type ProjectConfig } from "../libs/config";
import db from ".";
import { upsertMultiTags } from "./tags";

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

export function moveTicketFile(
  baseFolder: string,
  ticketsFolder: string,
  archivedFolder: string,
  filename: string,
  newFilename: string
): boolean {
  const currentTicketPath = path.join(".", baseFolder, ticketsFolder, filename);
  if (!fs.existsSync(currentTicketPath)) return false;

  try {
    const newTicketPath = path.join(
      ".",
      baseFolder,
      archivedFolder,
      newFilename
    );
    fs.copyFileSync(currentTicketPath, newTicketPath);
    fs.unlinkSync(currentTicketPath);
    return true;
  } catch (err) {
    console.error(
      `Error whilst moving file "${currentTicketPath}"  to "${archivedFolder}/"`
    );
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

  //TODO: add tags refresh
  if (ticket.tags.length > 0) {
    const oldTags = db().data.tags;
    const [newTags] = upsertMultiTags(ticket.tags, oldTags);
    db().data.tags = newTags;
  }

  await db().write();

  const basePath = config.baseFolder;
  try {
    fs.writeFileSync(
      path.join(".", basePath, TICKETS_FOLDER, ticket.filename),
      ticket.toMarkdown()
    );
    return true;
  } catch (err) {
    console.error(`Failed to save ${ticket.filename}`);
    return false;
  }
}
