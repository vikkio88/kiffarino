import type { Context } from "hono";
import { read, write } from "../../../db";
import { upsertTag } from "../../../db/tags";
import type { ApiResult } from "@kiffarino/shared";
import { createTagSchema } from "./schemas";

export async function add(c: Context) {
  const body = await c.req.json();
  const parsed = createTagSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ ...parsed.error.issues }, 422);
  }

  const db = await read();
  const [tags, newTag] = upsertTag(parsed.data.tag, db.tags);
  db.tags = tags;
  await write();

  return c.json<ApiResult<string>>(
    {
      result: newTag,
    },
    201
  );
}
