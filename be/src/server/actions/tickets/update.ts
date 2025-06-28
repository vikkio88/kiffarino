import type { Context } from "hono";
import { Ticket, TICKETS_SUBFOLDER } from "@kiffarino/shared";
import { loadTicketFromFile, save } from "../../../db/tickets";
import { loadConfig } from "../../../libs/config";
import { updateTicketSchema } from "./schemas";
import { type ApiResult } from "@kiffarino/shared";
import { read } from "../../../db";

export async function update(c: Context) {
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = updateTicketSchema.safeParse(body);

  if (!parsed.success) {
    console.error(parsed.error);
    return c.json({ ...parsed.error.issues }, 422);
  }

  const updates = parsed.data;
  const db = await read();
  const ticketRecord = db.tickets.find((t) => t.id === id);

  if (!ticketRecord) {
    return c.json({}, 404);
  }

  const { baseFolder } = loadConfig();
  const ticket = loadTicketFromFile(
    baseFolder,
    TICKETS_SUBFOLDER,
    ticketRecord.filename
  );

  if (!ticket) {
    console.error(`Found record for ticket: ${id} but no  file.`);
    return c.json({}, 404);
  }

  if (updates.title) ticket.title = updates.title;
  if (updates.body) ticket.body = updates.body;
  if (updates.tags) ticket.tags = updates.tags;
  if (updates.type) ticket.type = updates.type;
  if (updates.status) ticket.status = updates.status;
  if (updates.priority !== undefined) ticket.priority = updates.priority;
  ticket.updatedAt = Date.now();

  await save(ticket, true);

  return c.json<ApiResult<Ticket>>({ result: ticket }, 200);
}
