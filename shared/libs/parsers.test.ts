import { describe, test, expect } from "bun:test";
import { parseJsTimestamp, parseMd } from "./parsers";
import { Link } from "../models/ticket";

describe("parseMd", () => {
  test("parses all metadata fields correctly", () => {
    const markdown = `---
id: abc-123
title: Hello World
tags: bug,urgent
status: done
priority: 1
createdAt: 1710000000000
updatedAt: 1710000100000
links: [{"type":"blocks","linkedId":"xyz-999"}]
---
This is the body.`;

    const result = parseMd(markdown);

    expect(result.id).toBe("abc-123");
    expect(result.title).toBe("Hello World");
    expect(result.tags).toBe("bug,urgent");
    expect(result.status).toBe("done");
    expect(result.priority).toBe(1);
    expect(result.createdAt).toBe(1710000000000);
    expect(result.updatedAt).toBe(1710000100000);
    expect(result.links).toHaveLength(1);
    expect(result.links[0]).toEqual(new Link("xyz-999", "blocks"));
    expect(result.body).toBe("This is the body.");
  });

  test("defaults missing values properly", () => {
    const markdown = `---
title: Only title
---
Only a title is provided.`;

    const result = parseMd(markdown);

    expect(result.id).toMatch(/^[\w-]+$/);
    expect(result.title).toBe("Only title");
    expect(result.tags).toBe(null);
    expect(result.status).toBe("todo");
    expect(result.priority).toBe(3);
    expect(result.createdAt).toBeUndefined();
    expect(result.updatedAt).toBeUndefined();
    expect(result.links).toEqual([]);
    expect(result.body).toBe("Only a title is provided.");
  });

  test("throws if metadata comment is missing", () => {
    const markdown = `# No metadata block\n\nHello.`;
    expect(() => parseMd(markdown)).toThrow("Missing frontmatter block.");
  });

  test("ignores malformed metadata lines", () => {
    const markdown = `---
id: abc
this is invalid
title: Something
also-bad
status: done
---
Body content.`;

    const result = parseMd(markdown);

    expect(result.id).toBe("abc");
    expect(result.title).toBe("Something");
    expect(result.status).toBe("done");
  });

  test("handles non-numeric or invalid timestamps", () => {
    const markdown = `---
title: Bad timestamps
createdAt: potato
updatedAt: NaN
---
Something`;

    const result = parseMd(markdown);
    expect(result.createdAt).toBeUndefined();
    expect(result.updatedAt).toBeUndefined();
  });

  test("handles invalid JSON in links", () => {
    const markdown = `---
title: Bad links
links: not-a-json
---
Something`;

    const result = parseMd(markdown);
    expect(result.links).toEqual([]);
  });

  test("filters malformed link entries", () => {
    const markdown = `---
title: Mixed links
links: [{"linkedId":"id1","type":"blocks"},{"foo":"bar"}]
---
Test`;

    const result = parseMd(markdown);
    expect(result.links).toHaveLength(1);
    expect(result.links[0]).toEqual(new Link("id1", "blocks"));
  });

  test("body can contain HTML comments without affecting parse", () => {
    const markdown = `---
id: body-test
title: Embedded comment
---
This is body content. <!-- not metadata --> More text.`;

    const result = parseMd(markdown);
    expect(result.body).toContain("<!-- not metadata -->");
    expect(result.title).toBe("Embedded comment");
  });
});

describe("parseJsTimestamp", () => {
  test("parses valid timestamps", () => {
    expect(parseJsTimestamp("1710000000000")).toBe(1710000000000);
  });

  test("returns undefined for non-numeric or invalid input", () => {
    expect(parseJsTimestamp("banana")).toBeUndefined();
    expect(parseJsTimestamp("NaN")).toBeUndefined();
    expect(parseJsTimestamp("-100")).toBeUndefined();
    expect(parseJsTimestamp(undefined)).toBeUndefined();
  });

  test("returns undefined for 0 or negative", () => {
    expect(parseJsTimestamp("0")).toBeUndefined();
    expect(parseJsTimestamp("-1")).toBeUndefined();
  });
});
