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
    expect(ticket.type).toBe("task");
    expect(ticket.status).toBe("backlog");
    expect(ticket.links).toHaveLength(0);

    expect(ticket.createdAt).toBeGreaterThanOrEqual(before);
    expect(ticket.createdAt).toBeLessThanOrEqual(after);
    expect(ticket.updatedAt).toBeGreaterThanOrEqual(before);
    expect(ticket.updatedAt).toBeLessThanOrEqual(after);

    expect(ticket.filename).toContain(ticket.id);
  });

  test("tags", () => {
    const ticket = createTicket("Stuff", { status: "backlog" });
    expect(ticket.tags).toEqual([]);

    const tagged = createTicket("tagged", { tagsString: "ciao,come,stai" });
    expect(tagged.tags).toEqual(["ciao", "come", "stai"]);
  });
  test("tags non string", () => {
    const tagged = createTicket("tagged", { tags: ["ciao", "come", "stai"] });
    expect(tagged.tags).toEqual(["ciao", "come", "stai"]);
    expect(tagged.toMarkdown()).toInclude("ciao,come,stai");
  });

  test("type", () => {
    const typed = createTicket("typed", { type: "bug" });
    expect(typed.type).toEqual("bug");
    expect(typed.toMarkdown()).toInclude("bug");
  });

  test("custom body is inserted correctly", () => {
    const ticket = createTicket("Custom Body", {
      body: "This is a custom body.",
    });
    expect(ticket.body).toBe("This is a custom body.");
    expect(ticket.toMarkdown()).toInclude("This is a custom body.");
  });

  test("custom status is used", () => {
    const ticket = createTicket("In Progress", { status: "inProgress" });
    expect(ticket.status).toBe("inProgress");
    expect(ticket.toMarkdown()).toInclude("inProgress");
  });

  test("empty tags string results in empty tag list", () => {
    const ticket = createTicket("No Tags", { tagsString: "" });
    expect(ticket.tags).toEqual([]);
  });

  test("tags array overrides tags string", () => {
    const ticket = createTicket("Override Tags", {
      tagsString: "foo,bar",
      tags: ["actual", "tags"],
    });
    expect(ticket.tags).toEqual(["actual", "tags"]);
    expect(ticket.toMarkdown()).toInclude("actual,tags");
    expect(ticket.toMarkdown()).not.toInclude("foo,bar");
  });

  test("filename includes .md and id", () => {
    const ticket = createTicket("Filename Check");
    expect(ticket.filename).toMatch(/\.md$/);
    expect(ticket.filename).toContain(ticket.id);
  });

  test("markdown frontmatter is correctly formatted", () => {
    const ticket = createTicket("Markdown Check", {
      type: "task",
      status: "inProgress",
      tags: ["ui", "frontend"],
      body: "Let's work on this.",
    });

    const md = ticket.toMarkdown();
    expect(md).toInclude(`title: Markdown Check`);
    expect(md).toInclude(`type: task`);
    expect(md).toInclude(`status: inProgress`);
    expect(md).toInclude(`tags: ui,frontend`);
    expect(md).toInclude(`Let's work on this.`);
  });

  test("different timestamps are respected on quick creation", async () => {
    const ticket1 = createTicket("1");
    await new Promise((res) => setTimeout(res, 10));
    const ticket2 = createTicket("2");

    expect(ticket1.createdAt).toBeLessThan(ticket2.createdAt!);
    expect(ticket2.updatedAt).toBeGreaterThanOrEqual(ticket2.createdAt!);
  });
});
