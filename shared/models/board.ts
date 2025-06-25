import type { TicketRecord, TicketStatus } from "./ticket";

export type Board = Pick<
  Record<TicketStatus, TicketRecord[]>,
  "todo" | "inProgress" | "done"
>;
