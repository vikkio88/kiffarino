import { type ApiResult, type TicketRecord, type TicketStatus } from "@kiffarino/shared";
import type { Context } from "hono";
import { ticketFilterSchema } from "./schemas";
import { read } from "../../../db";
import { sort } from "../../../db/tickets";

export async function filter(c: Context) {
  const query = Object.fromEntries(new URLSearchParams(c.req.query()));
  const parsed = ticketFilterSchema.safeParse(query);

  if (!parsed.success) {
    return c.json(
      {
        ...parsed.error.issues,
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

  return c.json<ApiResult<TicketRecord[]>>({ result: result.toSorted(sort.byUpdatedDESC) }, 200);
}
