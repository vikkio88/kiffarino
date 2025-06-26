import {
  type ApiResult,
  type Board,
  type TicketRecord,
} from "@kiffarino/shared";
import type { Context } from "hono";
import { read } from "../../../db";
import { sort } from "../../../db/tickets";

export async function board(c: Context) {
  const todo: TicketRecord[] = [];
  const inProgress: TicketRecord[] = [];
  const done: TicketRecord[] = [];

  const db = await read();

  for (const t of db.tickets) {
    if (t.status === "todo") todo.push(t);
    else if (t.status === "inProgress") inProgress.push(t);
    else if (t.status === "done") done.push(t);
  }

  return c.json<ApiResult<Board>>(
    {
      result: {
        todo: todo.toSorted(sort.byCreatedASC),
        inProgress: inProgress.toSorted(sort.byCreatedASC),
        done: done.toSorted(sort.byUpdatedDESC),
      },
    },
    200
  );
}
