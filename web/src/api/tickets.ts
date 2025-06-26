import {
  Ticket,
  type ApiResult,
  type Board,
  type TicketRecord,
  type TicketStatus,
} from "@kiffarino/shared";
import { get, put } from "./http";
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
