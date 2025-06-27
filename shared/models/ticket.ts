import { parseMd } from "../libs/parsers";

export type LinkType = "blockedBy" | "blocks" | "linked";

export class Link {
  type: LinkType = "linked";
  linkedId: string;

  constructor(linkedId: string, type: LinkType) {
    this.linkedId = linkedId;
    this.type = type;
  }
}
export const ticketStatuses = [
  "idea",
  "backlog",
  "todo",
  "inProgress",
  "done",
] as const;
export type TicketStatus = (typeof ticketStatuses)[number];

export const ticketTypes = ["spike", "bug", "task"] as const;
export type TicketType = (typeof ticketTypes)[number];

export function calculateStatus(
  current: TicketStatus,
  direction: -1 | 1
): TicketStatus {
  const index = ticketStatuses.findIndex((s) => s === current);
  const nextIndex = index + direction;
  return ticketStatuses[nextIndex] ?? current;
}

export type Meta = {
  status: TicketStatus;
  priority: number;
};

const TAG_SEPARATOR = ",";

export class Ticket {
  id: string;
  title: string;
  tags: string[];
  createdAt: number | undefined;
  updatedAt: number | undefined;
  type: TicketType;
  status: TicketStatus;
  priority: number;
  links: Link[] = [];
  body: string;
  filename: string;

  constructor(markdownBody: string, filename: string) {
    const {
      id,
      title,
      tags,
      body,
      type,
      status,
      priority,
      createdAt,
      updatedAt,
      links = [],
    } = parseMd(markdownBody);

    this.id = id;
    this.title = title;
    this.tags = tags
      ? tags
          .split(TAG_SEPARATOR)
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    this.body = body;
    this.type = type;
    this.status = status;
    this.priority = priority;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.links = links;
    this.filename = filename;
  }

  toMarkdown(): string {
    const lines: string[] = [];

    lines.push("<!--");

    if (this.id) lines.push(`id: ${this.id}`);
    if (this.title) lines.push(`title: ${this.title}`);
    if (this.tags) lines.push(`tags: ${this.tags.join(TAG_SEPARATOR)}`);
    if (this.type) lines.push(`type: ${this.type}`);
    if (this.status) lines.push(`status: ${this.status}`);
    if (typeof this.priority === "number")
      lines.push(`priority: ${this.priority}`);
    lines.push(`createdAt: ${this.createdAt ?? Date.now()}`);
    lines.push(`updatedAt: ${this.updatedAt ?? Date.now()}`);
    if (this.links.length > 0)
      lines.push(
        `links: ${JSON.stringify(
          this.links.map((l) => ({ type: l.type, linkedId: l.linkedId }))
        )}`
      );

    lines.push("-->");
    lines.push("");
    lines.push(this.body);

    return lines.join("\n");
  }

  toRecord(): TicketRecord {
    return {
      id: this.id,
      title: this.title,
      tags: this.tags,
      type: this.type,
      status: this.status,
      priority: this.priority,
      createdAt: this.createdAt || Date.now(),
      updatedAt: this.updatedAt || Date.now(),
      filename: this.filename,
    };
  }
}

export type TicketRecord = {
  id: string;
  title: string;
  tags: string[];
  type: TicketType;
  status: TicketStatus;
  priority: number;
  createdAt: number | null;
  updatedAt: number | null;
  filename: string;
};
