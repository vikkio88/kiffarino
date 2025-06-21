import { Ticket } from "@kiffarino/shared";
import type { Context } from "hono";
import z from "zod";

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
  return c.json(
    {
      result: ticket,
    },
    201
  );
}
