import type { Context } from "hono";
import { read, write } from "../../../db";
import { unlinkTickets } from "../../../db/links";

export async function removeLink(c: Context) {
  const id = c.req.param("id");
  const linkedId = c.req.param("linkedId");

  if (!linkedId) {
    return c.json({ error: `Missing linked ticket id` }, 422);
  }

  const db = await read();
  if (!db.links[id] || !db.links[id].find((l) => l.linkedId === linkedId)) {
    return c.json({ error: "Link does not exists" }, 422);
  }

  try {
    db.links = unlinkTickets(db.links, { id }, { id: linkedId });
    await write();
    return c.json({}, 200);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Cannot unlink" }, 500);
  }
}
