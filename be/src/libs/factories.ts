import {
  Ticket,
  type CreateTicketParams,
  type TicketStatus,
  type TicketType,
} from "@kiffarino/shared";
import { generatedId } from "./id";

export function createTicket(
  title: string,
  params: CreateTicketParams = {}
): Ticket {
  const id = generatedId();
  return Ticket.make(id, title, params);
}
