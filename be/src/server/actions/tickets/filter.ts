import { type ApiResult } from "@kiffarino/shared";
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
    return (
      (filters.status ? t.status === filters.status : true) &&
      (filters.priority !== undefined
        ? t.priority === filters.priority
        : true) &&
      (filters.title
        ? t.title.toLowerCase().includes(filters.title.toLowerCase())
        : true)
    );
  });

  return c.json<ApiResult<TicketRecord[]>>({ result }, 200);
}
