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
  links: {
    linkedId: string;
    title: string;
    type: "linked" | "blocks" | "blockedBy";
  }[];
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

  test("Linking Tickets", async () => {
    let res = await post(TICKETS_API, {
      title: "Ticket A",
      body: "first ticket",
    });
    expect(res.status).toBe(201);
    let result = await parse<{ result: LocalTicket }>(res);
    const ticketA = result!.result;
    const idA = ticketA.id;

    res = await post(TICKETS_API, { title: "Ticket B", body: "second ticket" });
    expect(res.status).toBe(201);
    result = await parse<{ result: LocalTicket }>(res);
    const ticketB = result!.result;
    const idB = ticketB.id;

    res = await post(u(TICKETS_API, idB, "link"), {
      type: "blockedBy",
      linkedId: idA,
    });
    expect(res.status).toBe(201);

    res = await get(u(TICKETS_API, idB));
    result = await parse<{ result: LocalTicket }>(res);
    const linksB = result!.result.links;
    expect(Array.isArray(linksB)).toBe(true);
    expect(
      linksB.find((l) => l.linkedId === idA && l.type === "blockedBy")
    ).toBeTruthy();

    res = await get(u(TICKETS_API, idA));
    result = await parse<{ result: LocalTicket }>(res);
    const linksA = result!.result.links;
    expect(Array.isArray(linksA)).toBe(true);
    expect(
      linksA.find((l) => l.linkedId === idB && l.type === "blocks")
    ).toBeTruthy();

    await del(u(TICKETS_API, idA));
    await del(u(TICKETS_API, idB));
  });

  test("Self-linking is not allowed", async () => {
    let res = await post(TICKETS_API, {
      title: "Self Link",
      body: "Self",
    });
    expect(res.status).toBe(201);
    let result = await parse<{ result: LocalTicket }>(res);
    const id = result!.result.id;

    res = await post(u(TICKETS_API, id, "link"), {
      type: "linked",
      linkedId: id,
    });

    expect(res.status).toBeGreaterThanOrEqual(400);

    res = await get(u(TICKETS_API, id));
    result = await parse<{ result: LocalTicket }>(res);
    const links = result!.result.links;
    expect(links.length).toBe(0);

    await del(u(TICKETS_API, id));
  });

  test("Duplicate links are not allowed", async () => {
    let res = await post(TICKETS_API, {
      title: "A",
      body: "a",
    });
    expect(res.status).toBe(201);
    let result = await parse<{ result: LocalTicket }>(res);
    const idA = result!.result.id;

    res = await post(TICKETS_API, {
      title: "B",
      body: "b",
    });
    expect(res.status).toBe(201);
    result = await parse<{ result: LocalTicket }>(res);
    const idB = result!.result.id;

    res = await post(u(TICKETS_API, idA, "link"), {
      type: "linked",
      linkedId: idB,
    });
    expect(res.status).toBe(201);

    res = await post(u(TICKETS_API, idA, "link"), {
      type: "linked",
      linkedId: idB,
    });
    expect(res.status).toBeGreaterThanOrEqual(400);

    res = await get(u(TICKETS_API, idA));
    result = await parse<{ result: LocalTicket }>(res);
    const linksA = result!.result.links.filter(
      (l) => l.linkedId === idB && l.type === "linked"
    );
    expect(linksA.length).toBe(1);

    res = await get(u(TICKETS_API, idB));
    result = await parse<{ result: LocalTicket }>(res);
    const linksB = result!.result.links.filter(
      (l) => l.linkedId === idA && l.type === "linked"
    );
    expect(linksB.length).toBe(1);

    await del(u(TICKETS_API, idA));
    await del(u(TICKETS_API, idB));
  });

  test("unlinking removes both directional links", async () => {
    let res = await post(TICKETS_API, {
      title: "Parent",
      body: "parent body",
    });
    expect(res.status).toBe(201);
    let result = await parse<{ result: LocalTicket }>(res);
    const parent = result!.result;
    const idA = parent.id;

    res = await post(TICKETS_API, {
      title: "Child",
      body: "child body",
    });
    expect(res.status).toBe(201);
    result = await parse<{ result: LocalTicket }>(res);
    const child = result!.result;
    const idB = child.id;

    res = await post(u(TICKETS_API, idA, "link"), {
      type: "blocks",
      linkedId: idB,
    });
    expect(res.status).toBe(201);

    res = await del(u(TICKETS_API, idA, "link", idB));
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_API, idA));
    result = await parse<{ result: LocalTicket }>(res);

    expect(result!.result.links.length).toBe(0);

    res = await get(u(TICKETS_API, idB));
    result = await parse<{ result: LocalTicket }>(res);
    expect(result!.result.links.length).toBe(0);

    await del(u(TICKETS_API, idA));
    await del(u(TICKETS_API, idB));
  });

  test("deleting a ticket removes links from others", async () => {
    let res = await post(TICKETS_API, { title: "A" });
    expect(res.status).toBe(201);
    let result = await parse<{ result: LocalTicket }>(res);
    const idA = result!.result.id;

    res = await post(TICKETS_API, { title: "B" });
    expect(res.status).toBe(201);
    result = await parse<{ result: LocalTicket }>(res);
    const idB = result!.result.id;

    res = await post(u(TICKETS_API, idA, "link"), {
      type: "linked",
      linkedId: idB,
    });
    expect(res.status).toBe(201);

    res = await del(u(TICKETS_API, idA));
    expect(res.status).toBe(200);

    res = await get(u(TICKETS_API, idB));
    result = await parse<{ result: LocalTicket }>(res);
    expect(result!.result.links.length).toBe(0);

    await del(u(TICKETS_API, idB));
  });
});
