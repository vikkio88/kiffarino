import type { Context } from "hono";
import { read } from "../../../db";
import { toTag, type ApiResult } from "@kiffarino/shared";
import { tagFilterSchema } from "./schemas";


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
