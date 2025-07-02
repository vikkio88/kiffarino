import { describe, test, expect } from "bun:test";
import { calculateStatus, Ticket, type TicketStatus } from "./ticket";

describe("Loading Ticket from Markdown", () => {
  test("parses metadata and body correctly, then returns it as its previous state", () => {
    const markdown = `---
id: abc-123
title: Fix layout bug
tags: one,two,three
type: task
status: inProgress
priority: 1
createdAt: 1718880000000
updatedAt: 1718880030000
---

This is the body of the ticket.
It describes what needs to be fixed.`;

    const ticket = new Ticket(markdown, "testTicket.md");

    expect(ticket.id).toBe("abc-123");
    expect(ticket.title).toBe("Fix layout bug");
    expect(ticket.tags).toEqual(["one", "two", "three"]);
    expect(ticket.type).toBe("task");
    expect(ticket.status).toBe("inProgress");
    expect(ticket.priority).toBe(1);
    expect(ticket.createdAt).toBe(1718880000000);
    expect(ticket.updatedAt).toBe(1718880030000);
    expect(ticket.body).toContain("This is the body of the ticket");
    expect(ticket.filename).toBe("testTicket.md");

    const md = ticket.toMarkdown();
    expect(md).toEqual(markdown);
  });
});

describe("Ticket edge cases", () => {
  test("handles missing timestamps by setting them to null", () => {
    const markdown = `---
id: test-id
title: Ticket with no timestamps
type: task
status: todo
priority: 2
---

Body content.`;

    const ticket = new Ticket(markdown, "no-timestamps.md");
    expect(ticket.createdAt).toBeUndefined();
    expect(ticket.updatedAt).toBeUndefined();
  });

  test("handles non-numeric timestamps by setting them to null", () => {
    const markdown = `---
id: test-id
title: Ticket with bad timestamps
status: todo
priority: 2
createdAt: banana
updatedAt: NaN
---

Some content.`;

    const ticket = new Ticket(markdown, "bad-timestamps.md");
    expect(ticket.createdAt).toBeUndefined();
    expect(ticket.updatedAt).toBeUndefined();
  });

  test("handles invalid JSON in links", () => {
    const markdown = `---
id: test-id
title: Invalid links JSON
status: todo
priority: 2
links: not-a-json
---

Bad links format.`;

    const ticket = new Ticket(markdown, "bad-links.md");
    expect(ticket.links).toEqual([]);
  });

  test("throws an error if metadata comment is missing", () => {
    const markdown = `# No metadata

This file is missing the comment block.`;

    expect(() => new Ticket(markdown, "no-comment.md")).toThrow(
      "Missing frontmatter block."
    );
  });

  test("defaults missing optional fields safely", () => {
    const markdown = `---
id: id-123
title: Minimal metadata
---

This is a very minimal ticket.`;

    const ticket = new Ticket(markdown, "minimal.md");
    expect(ticket.status).toBe("todo"); // default fallback
    expect(ticket.priority).toBe(3); // default fallback
    expect(ticket.links).toEqual([]);
  });

  test("generates random id if missing", () => {
    const markdown = `---
title: No ID Ticket
---

Some content.`;

    const ticket = new Ticket(markdown, "no-id.md");
    expect(ticket.id).toMatch(/^[\w-]{10,}$/); // uuid-like
  });

  test("defaults title if missing", () => {
    const markdown = `---
id: just-an-id
---

No title here.`;

    const ticket = new Ticket(markdown, "no-title.md");
    expect(ticket.title).toBe("Untitled");
  });

  test("parses tags", () => {
    const markdown = `---
id: just-an-id
title: tagged
tags: ciao,tag,one
---
    No title here.`;
    const ticket = new Ticket(markdown, "file.md");

    expect(ticket.tags).toEqual(["ciao", "tag", "one"]);
  });

  test("retains filename on construction", () => {
    const markdown = `---
id: abc
title: Filename test
status: todo
priority: 1
---
File test.`;

    const ticket = new Ticket(markdown, "my-file.md");
    expect(ticket.filename).toBe("my-file.md");
  });

  test("handles empty tags gracefully", () => {
    const markdown = `---
id: tag-test
title: Empty tags
tags:
status: todo
priority: 2
---
Body here.`;

    const ticket = new Ticket(markdown, "empty-tags.md");
    expect(ticket.tags).toEqual([]);
  });

  test("trims and filters tags with empty segments", () => {
    const markdown = `---
id: tag-test
title: Filter empty tags
tags: one, , two,   , ,three,
status: todo
type: task
priority: 1
---
Tags with extra commas and spaces.`;

    const ticket = new Ticket(markdown, "weird-tags.md");
    expect(ticket.tags).toEqual(["one", "two", "three"]);
  });

  test("toMarkdown fills in missing dates with current timestamps", () => {
    const markdown = `---
id: time-test
title: Test current timestamp
status: todo
type: task
priority: 1
---
Check timestamps.`;

    const ticket = new Ticket(markdown, "time.md");
    const before = Date.now();
    const result = ticket.toMarkdown();
    const after = Date.now();

    const createdAtMatch = result.match(/createdAt: (\d+)/);
    const updatedAtMatch = result.match(/updatedAt: (\d+)/);
    const createdAt = Number(createdAtMatch?.[1]);
    const updatedAt = Number(updatedAtMatch?.[1]);

    expect(createdAt).toBeGreaterThanOrEqual(before);
    expect(createdAt).toBeLessThanOrEqual(after);
    expect(updatedAt).toBeGreaterThanOrEqual(before);
    expect(updatedAt).toBeLessThanOrEqual(after);
  });
});

test("roundtrip works after modifying fields", () => {
  const markdown = `---
id: abc-123
title: Original
tags: one,two
type: task
status: backlog
priority: 1
---
Original body.`;

  const ticket = new Ticket(markdown, "mutate.md");
  ticket.title = "Updated title";
  ticket.status = "done";
  ticket.priority = 0;
  ticket.tags.push("three");
  ticket.body = "New content.";
  const out = ticket.toMarkdown();

  expect(out).toContain("title: Updated title");
  expect(out).toContain("status: done");
  expect(out).toContain("priority: 0");
  expect(out).toContain("tags: one,two,three");
  expect(out).toContain("New content.");
});

describe("calculateStatus", () => {
  test("returns same status if at the start and moving backward", () => {
    const result = calculateStatus("idea", -1);
    expect(result).toBe("idea");
  });

  test("returns same status if at the end and moving forward", () => {
    const result = calculateStatus("done", 1);
    expect(result).toBe("done");
  });

  test("moves forward to the next status", () => {
    const result = calculateStatus("todo", 1);
    expect(result).toBe("inProgress");
  });

  test("moves backward to the previous status", () => {
    const result = calculateStatus("inProgress", -1);
    expect(result).toBe("todo");
  });

  test("moves to done, then all the way back to idea", () => {
    let status: TicketStatus = "todo";
    status = calculateStatus(status, 1);
    expect(status).toBe("inProgress");

    status = calculateStatus(status, 1);
    expect(status).toBe("done");

    status = calculateStatus(status, -1);
    expect(status).toBe("inProgress");

    status = calculateStatus(status, -1);
    expect(status).toBe("todo");

    status = calculateStatus(status, -1);
    expect(status).toBe("backlog");

    status = calculateStatus(status, -1);
    expect(status).toBe("idea");

    status = calculateStatus(status, -1);
    expect(status).toBe("idea");
  });
});

describe("Loading Ticket from Markdown then returning record", () => {
  test("parses metadata and body correctly, then returns it as its previous state", () => {
    const markdown = `---
id: abc-123
title: Fix layout bug
tags: one,two,three
type: task
status: inProgress
priority: 1
createdAt: 1718880000000
updatedAt: 1718880030000
links: [{"type":"blocks","linkedId":"def-456"}]
---

This is the body of the ticket.
It describes what needs to be fixed.`;

    const ticket = new Ticket(markdown, "testTicket.md");
    const record = ticket.toRecord();

    expect("body" in record).toBeFalse();
    // TODO: add this when you link
    expect("links" in record).toBeFalse();
    expect(record).toEqual({
      id: "abc-123",
      title: "Fix layout bug",
      tags: ["one", "two", "three"],
      type: "task",
      status: "inProgress",
      priority: 1,
      createdAt: 1718880000000,
      updatedAt: 1718880030000,
      filename: "testTicket.md",
    });
  });
});
