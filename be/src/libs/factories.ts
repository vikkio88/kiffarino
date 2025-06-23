import { Ticket, type TicketStatus } from "@kiffarino/shared";
import { generatedId } from "./id";
import { toLowerCamelCase } from "./text";

export function createTicket(
  title: string,
  { status = "todo", body }: { body?: string; status?: TicketStatus } = {}
): Ticket {
  const id = generatedId();
  const filename = `${toLowerCamelCase(title)}-${id}.md`;
  const now = Date.now();

  const markdown = `<!--
id: ${id}
title: ${title}
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
