import type { TicketRecord } from "./ticket";

export type Board = {
  todo: TicketRecord[];
  inProgress: TicketRecord[];
  done: TicketRecord[];
};
