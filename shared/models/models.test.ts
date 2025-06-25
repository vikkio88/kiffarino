import { describe, test, expect } from "bun:test";
import { Ticket } from "./ticket";

describe("Loading Ticket from Markdown", () => {
  test("parses metadata and body correctly, then returns it as its previous state", () => {
    const markdown = `<!--
id: abc-123
title: Fix layout bug
tags: one,two,three
status: inProgress
priority: 1
createdAt: 1718880000000
updatedAt: 1718880030000
links: [{"type":"blocks","linkedId":"def-456"}]
-->

This is the body of the ticket.
It describes what needs to be fixed.`;

    const ticket = new Ticket(markdown, "testTicket.md");

    expect(ticket.id).toBe("abc-123");
    expect(ticket.title).toBe("Fix layout bug");
    expect(ticket.tags).toEqual(["one", "two", "three"]);
    expect(ticket.status).toBe("inProgress");
    expect(ticket.priority).toBe(1);
    expect(ticket.createdAt).toBe(1718880000000);
    expect(ticket.updatedAt).toBe(1718880030000);
    expect(ticket.links).toHaveLength(1);
    expect(ticket.links[0]!.linkedId).toBe("def-456");
    expect(ticket.links[0]!.type).toBe("blocks");
    expect(ticket.body).toContain("This is the body of the ticket");
    expect(ticket.filename).toBe("testTicket.md");

    const md = ticket.toMarkdown();
    expect(md).toEqual(markdown);
  });
});

describe("Ticket edge cases", () => {
  test("handles missing timestamps by setting them to null", () => {
    const markdown = `<!--
id: test-id
title: Ticket with no timestamps
status: todo
priority: 2
-->

Body content.`;

    const ticket = new Ticket(markdown, "no-timestamps.md");
    expect(ticket.createdAt).toBeUndefined();
    expect(ticket.updatedAt).toBeUndefined();
  });

  test("handles non-numeric timestamps by setting them to null", () => {
    const markdown = `<!--
id: test-id
title: Ticket with bad timestamps
status: todo
priority: 2
createdAt: banana
updatedAt: NaN
-->

Some content.`;

    const ticket = new Ticket(markdown, "bad-timestamps.md");
    expect(ticket.createdAt).toBeUndefined();
    expect(ticket.updatedAt).toBeUndefined();
  });

  test("handles invalid JSON in links", () => {
    const markdown = `<!--
id: test-id
title: Invalid links JSON
status: todo
priority: 2
links: not-a-json
-->

Bad links format.`;

    const ticket = new Ticket(markdown, "bad-links.md");
    expect(ticket.links).toEqual([]);
  });

  test("throws an error if metadata comment is missing", () => {
    const markdown = `# No metadata

This file is missing the comment block.`;

    expect(() => new Ticket(markdown, "no-comment.md")).toThrow(
      "Missing metadata comment block."
    );
  });

  test("defaults missing optional fields safely", () => {
    const markdown = `<!--
id: id-123
title: Minimal metadata
-->

This is a very minimal ticket.`;

    const ticket = new Ticket(markdown, "minimal.md");
    expect(ticket.status).toBe("todo"); // default fallback
    expect(ticket.priority).toBe(3); // default fallback
    expect(ticket.links).toEqual([]);
  });

  test("generates random id if missing", () => {
    const markdown = `<!--
title: No ID Ticket
-->

Some content.`;

    const ticket = new Ticket(markdown, "no-id.md");
    expect(ticket.id).toMatch(/^[\w-]{10,}$/); // uuid-like
  });

  test("defaults title if missing", () => {
    const markdown = `<!--
id: just-an-id
-->

No title here.`;

    const ticket = new Ticket(markdown, "no-title.md");
    expect(ticket.title).toBe("Untitled");
  });

  test("parses tags", () => {
    const markdown = `<!--
    id: just-an-id
    title: tagged
    tags: ciao,tag,one
    -->
    No title here.`;
    const ticket = new Ticket(markdown, "file.md");

    expect(ticket.tags).toEqual(["ciao", "tag", "one"]);
  });

  test("retains filename on construction", () => {
    const markdown = `<!--
id: abc
title: Filename test
status: todo
priority: 1
-->
File test.`;

    const ticket = new Ticket(markdown, "my-file.md");
    expect(ticket.filename).toBe("my-file.md");
  });

  test("handles empty tags gracefully", () => {
    const markdown = `<!--
id: tag-test
title: Empty tags
tags:
status: todo
priority: 2
-->
Body here.`;

    const ticket = new Ticket(markdown, "empty-tags.md");
    expect(ticket.tags).toEqual([]);
  });

  test("trims and filters tags with empty segments", () => {
    const markdown = `<!--
id: tag-test
title: Filter empty tags
tags: one, , two,   , ,three,
status: todo
priority: 1
-->
Tags with extra commas and spaces.`;

    const ticket = new Ticket(markdown, "weird-tags.md");
    expect(ticket.tags).toEqual(["one", "two", "three"]);
  });

  test("toMarkdown fills in missing dates with current timestamps", () => {
    const markdown = `<!--
id: time-test
title: Test current timestamp
status: todo
priority: 1
-->
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
  const markdown = `<!--
id: abc-123
title: Original
tags: one,two
status: backlog
priority: 1
-->
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