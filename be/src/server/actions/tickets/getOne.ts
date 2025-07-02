import type { Context } from "hono";
import { loadTicketFromFile } from "../../../db/tickets";
import {
  type Ticket,
  type ApiResult,
  TICKETS_FOLDER,
  type TicketRecord,
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
    TICKETS_FOLDER,
    ticketRecord.filename
  );

  if (!ticket) {
    console.error(
      `tickets.getOne: record found ${id}, but file ${ticketRecord.filename} not found`
    );
    return c.json({ error: "Not Found" }, 404);
  }

  if (ticket.hasLinks()) {
    const ids = ticket.linkIds().map((l) => l.linkedId);
    const t = db.tickets
      .filter((t) => ids.includes(t.id))
      .reduce((acc, ticket) => {
        acc[ticket.id] = ticket;
        return acc;
      }, {} as Record<string, TicketRecord>);
    //TODO: maybe report a broken link

    ticket.loadLinks(t);
  }

  return c.json<ApiResult<Ticket>>({ result: ticket }, 200);
}
