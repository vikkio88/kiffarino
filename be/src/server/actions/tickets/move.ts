import type { Context } from "hono";
import { Ticket, TICKETS_SUBFOLDER } from "@kiffarino/shared";
import { loadTicketFromFile, save } from "../../../db/tickets";
import { loadConfig } from "../../../libs/config";
import { moveTicketSchema } from "./schemas";
import { type ApiResult } from "@kiffarino/shared";
import { read } from "../../../db";

export async function move(c: Context) {
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = moveTicketSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ ...parsed.error.issues }, 422);
  }

  const { status } = parsed.data;
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

  ticket.status = status;
  ticket.updatedAt = Date.now();

  await save(ticket, true);
  return c.json<ApiResult<Ticket>>({ result: ticket }, 200);
}
