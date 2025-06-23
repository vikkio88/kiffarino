import type { Context } from "hono";
import { loadTicketFromFile } from "../../../db/tickets";
import {
  type Ticket,
  type ApiResult,
  TICKETS_SUBFOLDER,
} from "@kiffarino/shared";
import { loadConfig } from "../../../libs/config";
import { read } from "../../../db";

export async function getOne(c: Context) {
  const id = c.req.param("id");

  const db = await read();
  const ticketRecord = db.tickets.find((t) => t.id === id);

  if (!ticketRecord) {
    return c.json({ error: `Not found` }, 404);
  }

  const { baseFolder } = loadConfig();
  const ticket = loadTicketFromFile(
    baseFolder,
    TICKETS_SUBFOLDER,
    ticketRecord.filename
  );

  if (!ticket) {
    console.error(`tickets.getOne: record found ${id}, but file ${ticketRecord.filename} not found`);
    return c.json({ error: "Not Found" }, 404);
  }

  return c.json<ApiResult<Ticket>>({ result: ticket }, 200);
}
