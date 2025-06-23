import { describe, test, expect } from "bun:test";
import { del, get, post, put } from "../libs/http";
import { TICKETS_URL } from "./conf";
import { parse } from "../libs/resp";
import { u } from "../libs/uri";

type LocalTicketStatus = "idea" | "backlog" | "todo" | "inProgress" | "done";
type LocalTicket = {
  id: string;
  title: string;
  body: string;
  status: LocalTicketStatus;
};

describe("Tickets", () => {
  test("CRUD", async () => {
    let res = await post(TICKETS_URL, { title: "ciao" });
    expect(res.status).toBe(201);

    const ticket = await parse<{
      result: LocalTicket;
    }>(res);

    expect(ticket?.result?.id).not.toBeUndefined();
    expect(ticket?.result?.title).toBe("ciao");
    expect(ticket?.result?.body).toBe("Add description");
    const createdId = ticket!.result!.id;

    res = await get(u(TICKETS_URL, createdId));
    expect(res.status).toBe(200);
    const fetched = await parse<{ result: LocalTicket }>(res);
    expect(fetched?.result.title).toBe("ciao");

    res = await put<{ title: string }>(u(TICKETS_URL, createdId), {
      title: "Not Ciao",
    });
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_URL, createdId));
    const afterUpdatedfetched = await parse<{ result: LocalTicket }>(res);
    expect(afterUpdatedfetched?.result.title).toBe("Not Ciao");

    res = await del(u(TICKETS_URL, createdId));
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_URL, createdId));
    expect(res.status).toBe(404);
  });

  test("Moving Ticket", async () => {
    let res = await post(TICKETS_URL, { title: "ciao", body: "someBody" });
    expect(res.status).toBe(201);
    let result = await parse<{
      result: LocalTicket;
    }>(res);
    const ticket = result!.result;
    const id = ticket.id;

    expect(ticket.status).toBe("todo");

    res = await put<{ status: LocalTicketStatus }>(u(TICKETS_URL, id, "move"), {
      status: "inProgress",
    });
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_URL, id));
    result = await parse<{
      result: LocalTicket;
    }>(res);
    expect(result?.result.status).toBe("inProgress");

    res = await del(u(TICKETS_URL, id));
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_URL, id));
    expect(res.status).toBe(404);
  });
});
