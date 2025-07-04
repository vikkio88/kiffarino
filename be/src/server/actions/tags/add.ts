import type { Context } from "hono";

import z from "zod/v4";
import { read, write } from "../../../db";
import { upsertTag } from "../../../db/tags";
import type { ApiResult } from "@kiffarino/shared";

export const createTagSchema = z.object({
  tag: z.string().min(3),
});

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
