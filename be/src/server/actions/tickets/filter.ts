import { type ApiResult, type TicketStatus } from "@kiffarino/shared";
import type { Context } from "hono";
import { ticketFilterSchema } from "./schemas";
import { type TicketRecord } from "../../../db/tickets";
import { read } from "../../../db";

export async function filter(c: Context) {
  const query = Object.fromEntries(new URLSearchParams(c.req.query()));
  const parsed = ticketFilterSchema.safeParse(query);

  if (!parsed.success) {
    return c.json(
      {
        ...parsed.error.flatten(),
      },
      400
    );
  }

  const filters = parsed.data;

  const db = await read();
  const result = db.tickets.filter((t) => {
    const statusMatch = filters.statuses
      ? filters.statuses.includes(t.status as TicketStatus)
      : true;

    const priorityMatch =
      filters.priority !== undefined ? t.priority === filters.priority : true;

    const titleMatch = filters.title
      ? t.title.toLowerCase().includes(filters.title.toLowerCase())
      : true;

    return statusMatch && priorityMatch && titleMatch;
  });

  return c.json<ApiResult<TicketRecord[]>>({ result }, 200);
}
