import type { Context } from "hono";
import { addLinkSchema } from "./schemas";
import { read, write } from "../../../db";
import { createLink, mergeLinks } from "../../../db/links";
import type { ApiResult, Link } from "@kiffarino/shared";

export async function addLink(c: Context) {
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = addLinkSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ ...parsed.error.issues }, 422);
  }

  if (parsed.data.linkedId === id) {
    return c.json({ error: "Cannot self-link" }, 422);
  }

  const db = await read();

  if (
    db.links[id] &&
    db.links[id].find((l) => l.linkedId === parsed.data.linkedId)
  ) {
    return c.json({ error: "Link already exists" }, 422);
  }

  const ticketRecords = db.tickets.filter(
    (t) => t.id === id || t.id === parsed.data.linkedId
  );

  if (ticketRecords.length < 2) {
    return c.json({ error: `Linked or Linking Ticket not found` }, 404);
  }

  const linkingTicket = ticketRecords.find((t) => t.id === id)!;
  const linkedTicket = ticketRecords.find(
    (t) => t.id === parsed.data.linkedId
  )!;

  const links = createLink(linkingTicket, linkedTicket, parsed.data.type);

  const merged = mergeLinks(db.links, links);
  db.links = merged;
  await write();
  return c.json<ApiResult<Link>>({ result: { ...links[1] } }, 201);
}
