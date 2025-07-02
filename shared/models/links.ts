export type LinkType = "blockedBy" | "linked" | "blocks";

export class Link {
  type: LinkType = "linked";
  linkedId: string;

  constructor(linkedId: string, type: LinkType) {
    this.linkedId = linkedId;
    this.type = type;
  }
}

export class TitledLink {
  type: LinkType = "linked";
  linkedId: string;
  title: string;

  constructor(link: Link, title: string) {
    this.linkedId = link.linkedId;
    this.type = link.type;
    this.title = title;
  }
}
