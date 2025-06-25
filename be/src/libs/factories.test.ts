import { describe, test, expect } from "bun:test";
import { createTicket } from "./factories";

describe("Create a Ticket", () => {
  test("creates a basic ticket with defaults", () => {
    const title = "Fix Login Issue";
    const before = Date.now();

    const ticket = createTicket(title);
    const after = Date.now();

    expect(ticket.title).toBe(title);
    expect(ticket.body).toBe("Add description");
    expect(ticket.priority).toBe(0);
    expect(ticket.status).toBe("backlog");
    expect(ticket.links).toHaveLength(0);

    expect(ticket.createdAt).toBeGreaterThanOrEqual(before);
    expect(ticket.createdAt).toBeLessThanOrEqual(after);
    expect(ticket.updatedAt).toBeGreaterThanOrEqual(before);
    expect(ticket.updatedAt).toBeLessThanOrEqual(after);

    expect(ticket.filename).toContain("fixLoginIssue");
  });

  test("filename removes special characters and handles multiple spaces", () => {
    const title = " Fix!! Login --- Issue 42 ";
    const ticket = createTicket(title);
    expect(ticket.filename).toContain("fixLoginIssue42");
  });

  test("tags", () => {
    const ticket = createTicket("Stuff", { status: "backlog" });
    expect(ticket.tags).toEqual([]);

    const tagged = createTicket("tagged", { tagsString: "ciao,come,stai" });
    expect(tagged.tags).toEqual(["ciao", "come", "stai"]);
  });
});
