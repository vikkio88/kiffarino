import type { Doc } from "./doc";
import type { Ticket } from "./ticket";

export class Project {
  name: string;
  docs: Doc[] = [];
  board: Ticket[] = [];
  backlog: Ticket[] = [];
  constructor(name: string) {
    this.name = name;
  }
}
