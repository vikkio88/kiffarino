import { type ApiResult, Ticket } from "@kiffarino/shared";
import type { Context } from "hono";
import z from "zod";
import { save } from "../../../db/tickets";

const createTicketSchema = z.object({
  title: z.string(),
});

export async function create(c: Context) {
  const body = (await c.req.json()) as { title: string };
  const parsed = createTicketSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ ...parsed.error.flatten() }, 422);
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
