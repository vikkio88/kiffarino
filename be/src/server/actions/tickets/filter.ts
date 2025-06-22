import { type ApiResult } from "@kiffarino/shared";
import type { Context } from "hono";
import { ticketFilterSchema } from "./schemas";

export function filter(c: Context) {
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

  return c.json<ApiResult<typeof filters>>({ result: filters }, 200);
}
