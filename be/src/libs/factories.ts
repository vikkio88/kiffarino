import { Ticket, type TicketStatus, type TicketType } from "@kiffarino/shared";
import { generatedId } from "./id";
import { toLowerCamelCase } from "./text";

export function createTicket(
  title: string,
  {
    status = "backlog",
    body,
    tags = [],
    tagsString = "",
    type = "task",
  }: {
    body?: string;
    type?: TicketType;
    status?: TicketStatus;
    tags?: string[];
    tagsString?: string;
  } = {}
): Ticket {
  const id = generatedId();
  const filename = `${toLowerCamelCase(title)}-${id}.md`;
  const now = Date.now();

  const markdown = `<!--
id: ${id}
title: ${title}
tags: ${tags && tags.length > 0 ? tags.join(",") : tagsString}
type: ${type}
status: ${status}
priority: 0
createdAt: ${now}
updatedAt: ${now}
links: []
-->

${body || "Add description"}
`;

  return new Ticket(markdown, filename);
}
