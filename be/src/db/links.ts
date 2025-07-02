import { Link, type LinkType, type Ticket } from "@kiffarino/shared";

export function createLink(
  ticket: Partial<Ticket>,
  other: Partial<Ticket>,
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
