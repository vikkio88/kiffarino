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
export type TicketStatus = "idea" | "backlog" | "todo" | "inProgress" | "done";

export type Meta = {
  status: TicketStatus;
  priority: number;
};

export class Ticket {
  id: string;
  title: string;
  createdAt: number | undefined;
  updatedAt: number | undefined;
  status: TicketStatus;
  priority: number;
  links: Link[] = [];
  body: string;
  filename: string;

  constructor(markdownBody: string, filename: string) {
    const {
      id,
      title,
      body,
      status,
      priority,
      createdAt,
      updatedAt,
      links = [],
    } = parseMd(markdownBody);

    this.id = id;
    this.title = title;
    this.body = body;
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
}
