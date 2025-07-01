import { describe, test, expect } from "bun:test";
import { del, get, post, put } from "./http";
import { TICKETS_API } from "./shared";
import { parse, u } from "./libs";

import fs from "node:fs";

type LocalTicketStatus = "idea" | "backlog" | "todo" | "inProgress" | "done";
type LocalTicket = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  type: string;
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
    expect(ticket?.result?.type).toBe("task");
    expect(ticket?.result?.body).toBe("Add description");
    const createdId = ticket!.result!.id;

    res = await get(u(TICKETS_API, createdId));
    expect(res.status).toBe(200);
    const fetched = await parse<{ result: LocalTicket }>(res);
    expect(fetched?.result.title).toBe("ciao");

    res = await put<{ title: string; type: string }>(
      u(TICKETS_API, createdId),
      {
        title: "Not Ciao",
        type: "bug",
      }
    );
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_API, createdId));
    const afterUpdatedfetched = await parse<{ result: LocalTicket }>(res);
    expect(afterUpdatedfetched?.result.title).toBe("Not Ciao");
    expect(afterUpdatedfetched?.result.type).toBe("bug");

    res = await del(u(TICKETS_API, createdId));
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_API, createdId));
    expect(res.status).toBe(404);
  });

  test("crud with tags", async () => {
    let res = await post(TICKETS_API, { title: "ciao", tags: ["ciaotag"] });
    expect(res.status).toBe(201);

    const ticket = await parse<{
      result: LocalTicket;
    }>(res);

    expect(ticket?.result?.id).not.toBeUndefined();
    expect(ticket?.result?.tags).toEqual(["ciaotag"]);
    const createdId = ticket!.result!.id;

    res = await get(u(TICKETS_API, createdId));
    expect(res.status).toBe(200);
    const fetched = await parse<{ result: LocalTicket }>(res);
    expect(fetched?.result?.tags).toEqual(["ciaotag"]);

    res = await put<{ tags: string[] }>(u(TICKETS_API, createdId), {
      tags: [],
    });
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_API, createdId));
    const afterUpdatedfetched = await parse<{ result: LocalTicket }>(res);
    expect(afterUpdatedfetched?.result?.tags).toEqual([]);

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

  test("archiving Ticket", async () => {
    let res = await post(TICKETS_API, {
      title: "archiving test",
      body: "someBody",
    });
    expect(res.status).toBe(201);
    let result = await parse<{
      result: LocalTicket;
    }>(res);
    const ticket = result!.result;
    const id = ticket.id;

    res = await post<{ status: LocalTicketStatus }>(
      u(TICKETS_API, id, "archive")
    );
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_API, id));
    expect(res.status).toBe(404);
  });

  test("filters", async () => {
    const createdIds: string[] = [];

    const ticketsToCreate = [
      { title: "todo1", status: "todo" },
      { title: "todo2", status: "todo" },
      { title: "done1", status: "done" },
    ];

    for (const data of ticketsToCreate) {
      const res = await post(TICKETS_API, data);
      expect(res.status).toBe(201);
      const parsed = await parse<{ result: LocalTicket }>(res);
      createdIds.push(parsed!.result.id);
    }

    const res = await get(`${TICKETS_API}?status=todo`);
    expect(res.status).toBe(200);
    const filtered = await parse<{ result: LocalTicket[] }>(res);
    const mapped = filtered!.result.map((t) => t.title);
    expect(mapped).toContain("todo1");
    expect(mapped).toContain("todo2");

    // Cleanup
    for (const id of createdIds) {
      const res = await del(u(TICKETS_API, id));
      expect(res.status).toBe(200);
    }
  });

  test("board loading", async () => {
    const createdIds: string[] = [];

    const ticketsToCreate: { title: string; status: LocalTicketStatus }[] = [
      { title: "idea1", status: "idea" },
      { title: "backlog1", status: "backlog" },
      { title: "todo1", status: "todo" },
      { title: "done1", status: "done" },
    ];

    for (const data of ticketsToCreate) {
      const res = await post(TICKETS_API, data);
      expect(res.status).toBe(201);
      const parsed = await parse<{ result: LocalTicket }>(res);
      createdIds.push(parsed!.result.id);
    }

    const boardRes = await get(`${TICKETS_API}/board`);
    expect(boardRes.status).toBe(200);

    const board = await parse<{
      result: Partial<Record<LocalTicketStatus, LocalTicket[]>>;
    }>(boardRes);

    expect(
      board!.result.idea?.some((t) => t.title === "idea1")
    ).toBeUndefined();
    expect(
      board!.result.backlog?.some((t) => t.title === "backlog1")
    ).toBeUndefined();

    expect(board!.result.todo?.some((t) => t.title === "todo1")).toBe(true);
    expect(board!.result.done?.some((t) => t.title === "done1")).toBe(true);

    for (const id of createdIds) {
      const res = await del(u(TICKETS_API, id));
      expect(res.status).toBe(200);
    }
  });
});
