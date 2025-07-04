import type { Context } from "hono";
import z from "zod/v4";
import { read } from "../../../db";
import { toTag, type ApiResult } from "@kiffarino/shared";
export const tagFilterSchema = z.object({
  tag: z.coerce.string().optional(),
});

export async function filter(c: Context) {
  const query = Object.fromEntries(new URLSearchParams(c.req.query()));
  const parsed = tagFilterSchema.safeParse(query);
  const filters = parsed.data;

  const db = await read();
  let result: string[] = db.tags;
  if (filters?.tag)
    result = db.tags.filter((t) => {
      return t.includes(toTag(filters.tag!));
    });

  return c.json<ApiResult<string[]>>({ result }, 200);
}
