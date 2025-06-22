import { type ApiResult, Ticket } from "@kiffarino/shared";
import type { Context } from "hono";
import { save } from "../../../db/tickets";
import { createTicketSchema } from "./schemas";

export async function create(c: Context) {
  const body = (await c.req.json()) as { title: string };
  const parsed = createTicketSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ ...parsed.error.format() }, 422);
  }

  const ticket = Ticket.create(body.title);

  const result = save(ticket);
  if (!result) {
    return c.json({}, 410);
  }
  
  return c.json<ApiResult<Ticket>>(
    {
      result: ticket,
    },
    201
  );
}
