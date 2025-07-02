import { type TicketStatus, type TicketType } from "../models/ticket";

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
} {
  const frontmatterRegex = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    throw new Error("Missing frontmatter block.");
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

  const body = markdown.replace(frontmatterRegex, "").trim();

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
  };
}

export function parseJsTimestamp(val?: string): number | undefined {
  const parsed = Number(val);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}
