import type { Context } from "hono";
import { removeTicketFile } from "../../../db/tickets";
import { TICKETS_FOLDER } from "@kiffarino/shared";
import { loadConfig } from "../../../libs/config";
import { read, write } from "../../../db";

export async function del(c: Context) {
  const id = c.req.param("id");

  const db = await read();
  const ticketToDelete = db.tickets.find((t) => t.id === id);
  if (!ticketToDelete) {
    return c.json({}, 404);
  }

  const { filename } = ticketToDelete;
  db.tickets = db.tickets.filter((t) => t.id !== ticketToDelete.id);
  await write();

  const { baseFolder } = loadConfig();
  const result = removeTicketFile(baseFolder, TICKETS_FOLDER, filename);

  return result ? c.json({}, 200) : c.json({}, 500);
}
