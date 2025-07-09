import { describe, test, expect } from "bun:test";
import { parsePlugins } from "./plugins";

describe("parsePlugins", () => {
  test("parses plain markdown as simple_md", () => {
    const result = parsePlugins("hello world");
    expect(result).toEqual([
      { source: "hello world", plugin: { name: "simple_md" } },
    ]);
  });

  test("parses one plugin block", () => {
    const input = `
before

<!-- plugin: simple_md -->
inside
<!-- endplugin -->

after
    `;
    const result = parsePlugins(input);
    expect(result).toEqual([
      { source: "before", plugin: { name: "simple_md" } },
      { source: "inside", plugin: { name: "simple_md" } },
      { source: "after", plugin: { name: "simple_md" } },
    ]);
  });

  test("falls back to simple_md for unknown plugin", () => {
    const input = `
<!-- plugin: unknown -->
text
<!-- endplugin -->
    `;
    const result = parsePlugins(input);
    expect(result).toEqual([{ source: "text", plugin: { name: "simple_md" } }]);
  });

  test("parses multiple plugin blocks with mixed content", () => {
    const input = `
intro

<!-- plugin: simple_md -->
first
<!-- endplugin -->

<!-- plugin: unknown -->
second
<!-- endplugin -->

end
    `;
    const result = parsePlugins(input);
    expect(result).toEqual([
      { source: "intro", plugin: { name: "simple_md" } },
      { source: "first", plugin: { name: "simple_md" } },
      { source: "second", plugin: { name: "simple_md" } },
      { source: "end", plugin: { name: "simple_md" } },
    ]);
  });

  test("ignores empty sections", () => {
    const input = `
<!-- plugin: simple_md -->
<!-- endplugin -->
`;
    const result = parsePlugins(input);
    expect(result).toEqual([]);
  });

  test("handles unclosed plugin block as simple_md", () => {
    const input = `
<!-- plugin: simple_md -->
unfinished
`;
    const result = parsePlugins(input);
    expect(result).toEqual([
      { source: "unfinished", plugin: { name: "simple_md" } },
    ]);
  });

  test("plugin tag with uppercase still works", () => {
    const input = `
Intro

<!-- PLUGIN: simpleMd -->
Block
<!-- ENDPLUGIN -->

Outro
`;
    const result = parsePlugins(input);
    expect(result).toEqual([
      { source: "Intro", plugin: { name: "simple_md" } },
      { source: "Block", plugin: { name: "simple_md" } },
      { source: "Outro", plugin: { name: "simple_md" } },
    ]);
  });
});

describe("youtube plugin parser does not interfere with the rest", () => {
  test("preserves simple_md and youtube blocks separately", () => {
    const input = `
# This is normal markdown

<!-- plugin: youtube -->
[youtube](https://youtu.be/dQw4w9WgXcQ)
<!-- endplugin -->

## Another heading

<!-- plugin: simple_md -->
**bold text** and *italic text*
<!-- endplugin -->

Final line of text.
`;

    const result = parsePlugins(input);

    expect(result).toHaveLength(5);

    const youtubeSection = result.find((s) => s.plugin.name === "youtube");
    const simpleMdSection = result.find(
      (s) => s.plugin.name === "simple_md" && s.source.includes("**bold text**")
    );

    expect(youtubeSection?.source).toContain(
      "[youtube](https://youtu.be/dQw4w9WgXcQ)"
    );

    expect(simpleMdSection?.source).toContain("**bold text**");
    expect(simpleMdSection?.source).toContain("*italic text*");

    const defaultSections = result.filter((s) => s.plugin.name === "simple_md");
    expect(defaultSections.length).toBe(4);
  });
});
