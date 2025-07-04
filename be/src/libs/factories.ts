import {
  Ticket,
  type CreateTicketParams,
} from "@kiffarino/shared";
import { generatedId } from "./id";

export function createTicket(
  title: string,
  params: CreateTicketParams = {}
): Ticket {
  const id = generatedId();
  return Ticket.make(id, title, params);
}
