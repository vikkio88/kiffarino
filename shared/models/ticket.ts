import { id } from "../libs/id";
import { parseMd } from "../libs/parsers";
import { toLowerCamelCase } from "../libs/text";

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
  meta: Meta;
  links: Link[] = [];
  body: string;
  filename: string;

  constructor(markdownBody: string, filename: string) {
    const {
      id,
      title,
      body,
      meta,
      createdAt,
      updatedAt,
      links = [],
    } = parseMd(markdownBody);

    this.id = id;
    this.title = title;
    this.body = body;
    this.meta = meta;
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
    if (this.meta?.status) lines.push(`status: ${this.meta.status}`);
    if (typeof this.meta?.priority === "number")
      lines.push(`priority: ${this.meta.priority}`);
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

  static create(title: string, body?: string): Ticket {
    const generatedId = id();
    const filename = `${toLowerCamelCase(title)}-${generatedId}.md`;
    const now = Date.now();

    const markdown = `<!--
id: ${generatedId}
title: ${title}
status: todo
priority: 0
createdAt: ${now}
updatedAt: ${now}
links: []
-->

${body || "Add description"}
`;

    return new Ticket(markdown, filename);
  }
}
