import { type ApiResult, Ticket } from "@kiffarino/shared";
import type { Context } from "hono";
import { save } from "../../../db/tickets";
import { createTicketSchema } from "./schemas";
import { createTicket } from "../../../libs/factories";

export async function create(c: Context) {
  const body = await c.req.json();
  const parsed = createTicketSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ ...parsed.error.issues }, 422);
  }

  const { title, ...rest } = parsed.data;

  const ticket = createTicket(parsed.data.title, {
    ...rest,
  });

  const result = await save(ticket);
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
