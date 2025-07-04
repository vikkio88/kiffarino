import {
  Link,
  Ticket,
  type ApiResult,
  type Board,
  type TicketRecord,
  type TicketStatus,
} from "@kiffarino/shared";
import { get, put, del, post } from "./http";
import { p, parse, u } from "./libs";
import { TICKETS_API } from "./shared";

export type Filters = {
  statuses?: TicketStatus[];
  title?: string;
};

export async function one(id: string): Promise<ApiResult<Ticket> | null> {
  const resp = await get(u(TICKETS_API, id));

  if (resp.status !== 200) {
    return null;
  }

  return parse<ApiResult<Ticket>>(resp);
}

export async function filter(
  filters: Filters = {}
): Promise<ApiResult<TicketRecord[]> | null> {
  const resp = await get(`${TICKETS_API}${p(filters)}`);

  if (resp.status !== 200) {
    return null;
  }

  return parse<ApiResult<TicketRecord[]>>(resp);
}

export async function board(): Promise<ApiResult<Board> | null> {
  const resp = await get(u(TICKETS_API, "board"));

  if (resp.status !== 200) {
    return null;
  }

  return parse<ApiResult<Board>>(resp);
}

export async function move(id: string, status: TicketStatus): Promise<boolean> {
  const resp = await put(u(TICKETS_API, id, "move"), { status });
  return resp.status === 200;
}

export async function update(
  id: string,
  updates: Partial<TicketRecord>
): Promise<boolean> {
  const resp = await put(u(TICKETS_API, id), { ...updates });
  return resp.status === 200;
}

export async function deleteTicket(id: string): Promise<boolean> {
  const resp = await del(u(TICKETS_API, id));
  return resp.status === 200;
}

export async function archive(id: string): Promise<boolean> {
  const resp = await post(u(TICKETS_API, id, "archive"));
  return resp.status === 200;
}

export async function create(ticket: Partial<Ticket>): Promise<boolean> {
  const resp = await post(TICKETS_API, ticket);
  return resp.status === 201;
}

export async function createWithRespBody(
  ticket: Partial<Ticket>
): Promise<ApiResult<TicketRecord> | null> {
  const resp = await post(TICKETS_API, ticket);
  if (resp.status !== 201) {
    return null;
  }

  return parse<ApiResult<TicketRecord>>(resp);
}

export async function createLink(
  ticketId: string,
  link: Link
): Promise<boolean> {
  const resp = await post(u(TICKETS_API, ticketId, "link"), { ...link });

  return resp.status === 201;
}

export async function removeLink(
  ticketId: string,
  linkedId: string
): Promise<boolean> {
  const resp = await del(u(TICKETS_API, ticketId, "link", linkedId));

  return resp.status === 200;
}
