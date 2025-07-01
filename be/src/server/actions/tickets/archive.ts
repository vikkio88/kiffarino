import type { Context } from "hono";
import { moveTicketFile } from "../../../db/tickets";
import { ARCHIVED_TICKETS_FOLDER, TICKETS_FOLDER } from "@kiffarino/shared";
import { loadConfig } from "../../../libs/config";
import { read, write } from "../../../db";
import { toFilename } from "../../../libs/text";

export async function archive(c: Context) {
  const id = c.req.param("id");

  const db = await read();
  const ticketToArchive = db.tickets.find((t) => t.id === id);
  if (!ticketToArchive) {
    return c.json({}, 404);
  }

  const { filename } = ticketToArchive;
  db.tickets = db.tickets.filter((t) => t.id !== ticketToArchive.id);
  await write();

  const { baseFolder } = loadConfig();
  const newFilename = `${toFilename(ticketToArchive.title)}.md`;
  ticketToArchive.updatedAt = Date.now();
  const result = moveTicketFile(
    baseFolder,
    TICKETS_FOLDER,
    ARCHIVED_TICKETS_FOLDER,
    filename,
    newFilename
  );

  return result ? c.json({}, 200) : c.json({}, 500);
}
