import { describe, test, expect } from "bun:test";
import { del, get, post, put } from "./http";
import { TICKETS_API } from "./shared";
import { parse, u } from "./libs";

type LocalTicketStatus = "idea" | "backlog" | "todo" | "inProgress" | "done";
type LocalTicket = {
  id: string;
  title: string;
  body: string;
  status: LocalTicketStatus;
};

describe("Tickets", () => {
  test("CRUD", async () => {
    let res = await post(TICKETS_API, { title: "ciao" });
    expect(res.status).toBe(201);

    const ticket = await parse<{
      result: LocalTicket;
    }>(res);

    expect(ticket?.result?.id).not.toBeUndefined();
    expect(ticket?.result?.title).toBe("ciao");
    expect(ticket?.result?.body).toBe("Add description");
    const createdId = ticket!.result!.id;

    res = await get(u(TICKETS_API, createdId));
    expect(res.status).toBe(200);
    const fetched = await parse<{ result: LocalTicket }>(res);
    expect(fetched?.result.title).toBe("ciao");

    res = await put<{ title: string }>(u(TICKETS_API, createdId), {
      title: "Not Ciao",
    });
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_API, createdId));
    const afterUpdatedfetched = await parse<{ result: LocalTicket }>(res);
    expect(afterUpdatedfetched?.result.title).toBe("Not Ciao");

    res = await del(u(TICKETS_API, createdId));
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_API, createdId));
    expect(res.status).toBe(404);
  });

  test("Moving Ticket", async () => {
    let res = await post(TICKETS_API, { title: "ciao", body: "someBody" });
    expect(res.status).toBe(201);
    let result = await parse<{
      result: LocalTicket;
    }>(res);
    const ticket = result!.result;
    const id = ticket.id;

    expect(ticket.status).toBe("backlog");

    res = await put<{ status: LocalTicketStatus }>(u(TICKETS_API, id, "move"), {
      status: "inProgress",
    });
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_API, id));
    result = await parse<{
      result: LocalTicket;
    }>(res);
    expect(result?.result.status).toBe("inProgress");

    res = await del(u(TICKETS_API, id));
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_API, id));
    expect(res.status).toBe(404);
  });

  test("filters", async () => {});
  test("board loading", async () => {});
});
