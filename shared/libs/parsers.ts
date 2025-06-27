import { Link, type TicketStatus, type TicketType } from "../models/ticket";

export function parseMd(markdown: string): {
  id: string;
  title: string;
  tags: string | null;
  body: string;
  type: TicketType;
  status: TicketStatus;
  priority: number;
  createdAt: number | undefined;
  updatedAt: number | undefined;
  links: Link[];
} {
  const commentRegex = /^<!--([\s\S]*?)-->/;
  const match = markdown.match(commentRegex);

  if (!match) {
    throw new Error("Missing metadata comment block.");
  }

  const rawMeta = match[1]!;
  const metaLines = rawMeta
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const metaMap: Record<string, string> = {};
  for (const line of metaLines) {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) continue;
    metaMap[key.trim()] = rest.join(":").trim();
  }

  const id = metaMap["id"] ?? crypto.randomUUID();
  const title = metaMap["title"] ?? "Untitled";
  const tags = metaMap["tags"] ?? null;
  const status = (metaMap["status"] as TicketStatus) ?? "todo";
  const type = (metaMap["type"] as TicketType) ?? "task";
  const priority = parseInt(metaMap["priority"] ?? "3", 10);
  const createdAt = parseJsTimestamp(metaMap["createdAt"]);
  const updatedAt = parseJsTimestamp(metaMap["updatedAt"]);

  let links: Link[] = [];
  if (metaMap["links"]) {
    try {
      const raw = JSON.parse(metaMap["links"]);
      if (Array.isArray(raw)) {
        links = raw
          .filter((link) => typeof link === "object" && link.linkedId)
          .map((link) => new Link(link.linkedId, link.type));
      }
    } catch (e) {
      console.warn(`⚠️ Failed to parse links for ticket ${id}`);
    }
  }

  const body = markdown.replace(commentRegex, "").trim();

  return {
    id,
    title,
    tags,
    body,
    type,
    status,
    priority,
    createdAt,
    updatedAt,
    links,
  };
}

export function parseJsTimestamp(val?: string): number | undefined {
  const parsed = Number(val);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}
