import { Link, type LinkType, type TicketRecord } from "@kiffarino/shared";

export function createLink(
  ticket: Partial<TicketRecord>,
  other: Partial<TicketRecord>,
  type: LinkType
): [string, Link, string, Link] {
  if (!ticket.id || !other.id) throw new Error("Both tickets must have an id");

  switch (type) {
    case "linked":
      return [
        ticket.id,
        new Link(other.id, "linked"),
        other.id,
        new Link(ticket.id, "linked"),
      ];
    case "blocks":
      return [
        ticket.id,
        new Link(other.id, "blocks"),
        other.id,
        new Link(ticket.id, "blockedBy"),
      ];
    case "blockedBy":
      return [
        ticket.id,
        new Link(other.id, "blockedBy"),
        other.id,
        new Link(ticket.id, "blocks"),
      ];
  }
}

export function mergeLinks(
  links: Record<string, Link[]>,
  [idA, linkA, idB, linkB]: [string, Link, string, Link]
) {
  return {
    ...links,
    [idA]: [...(links[idA] || []), linkA],
    [idB]: [...(links[idB] || []), linkB],
  };
}

export function removeLink(
  links: Record<string, Link[]>,
  [idA, linkA, idB, linkB]: [string, Link, string, Link]
): Record<string, Link[]> {
  return {
    ...links,
    [idA]: (links[idA] || []).filter(
      (l) => l.linkedId !== linkA.linkedId || l.type !== linkA.type
    ),
    [idB]: (links[idB] || []).filter(
      (l) => l.linkedId !== linkB.linkedId || l.type !== linkB.type
    ),
  };
}

export function unlinkTickets(
  links: Record<string, Link[]>,
  ticketA: Partial<TicketRecord>,
  ticketB: Partial<TicketRecord>
): Record<string, Link[]> {
  if (!ticketA.id || !ticketB.id)
    throw new Error("Both tickets must have an id");

  return {
    ...links,
    [ticketA.id]: (links[ticketA.id] || []).filter(
      (l) => l.linkedId !== ticketB.id
    ),
    [ticketB.id]: (links[ticketB.id] || []).filter(
      (l) => l.linkedId !== ticketA.id
    ),
  };
}

export function removeFromLinks(
  links: Record<string, Link[]>,
  targetId: string
): Record<string, Link[]> {
  const related = links[targetId] || [];

  const result = { ...links };

  delete result[targetId];

  for (const link of related) {
    result[link.linkedId] = (result[link.linkedId] || []).filter(
      (l) => l.linkedId !== targetId
    );

    if (result[link.linkedId]?.length === 0) {
      delete result[link.linkedId];
    }
  }

  return result;
}
