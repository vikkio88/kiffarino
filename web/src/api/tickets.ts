import { Ticket, type ApiResult, type TicketStatus } from "@kiffarino/shared";
import { get } from "./http";
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
): Promise<ApiResult<Ticket[]> | null> {
  const resp = await get(`${TICKETS_API}${p(filters)}`);

  if (resp.status !== 200) {
    return null;
  }

  return parse<ApiResult<Ticket[]>>(resp);
}
