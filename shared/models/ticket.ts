import { parseMd } from "../libs/parsers";
import { type Link, TitledLink } from "./links";

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

export type CreateTicketParams = {
  body?: string;
  type?: TicketType;
  status?: TicketStatus;
  tags?: string[];
  tagsString?: string;
};

export class Ticket {
  id: string;
  title: string;
  tags: string[];
  createdAt: number | undefined;
  updatedAt: number | undefined;
  type: TicketType;
  status: TicketStatus;
  priority: number;
  links: TitledLink[] = [];
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

    // TODO: need to bootstrap them from db
    this.links = [];
    //

    this.filename = filename;
  }

  loadLinks(links: Link[], tickets: Record<string, TicketRecord>) {
    for (const l of links) {
      const t = tickets[l.linkedId];
      if (!t) continue;

      this.links.push(new TitledLink(l, t.title));
    }
  }

  static make(
    id: string,
    title: string,
    {
      status = "backlog",
      body,
      tags = [],
      tagsString = "",
      type = "task",
    }: CreateTicketParams = {}
  ): Ticket {
    const filename = `${id}.md`;
    const now = Date.now();
    const markdown = `---
id: ${id}
title: ${title}
tags: ${tags && tags.length > 0 ? tags.join(TAG_SEPARATOR) : tagsString}
type: ${type}
status: ${status}
priority: 0
createdAt: ${now}
updatedAt: ${now}
---

${body || "Add description"}
`;

    return new Ticket(markdown, filename);
  }

  toMarkdown(): string {
    const lines: string[] = [];

    lines.push("---");

    if (this.id) lines.push(`id: ${this.id}`);
    if (this.title) lines.push(`title: ${this.title}`);
    if (this.tags) lines.push(`tags: ${this.tags.join(TAG_SEPARATOR)}`);
    if (this.type) lines.push(`type: ${this.type}`);
    if (this.status) lines.push(`status: ${this.status}`);
    if (typeof this.priority === "number")
      lines.push(`priority: ${this.priority}`);
    lines.push(`createdAt: ${this.createdAt ?? Date.now()}`);
    lines.push(`updatedAt: ${this.updatedAt ?? Date.now()}`);
    lines.push("---");
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
