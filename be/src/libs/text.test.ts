import { describe, expect, test } from "bun:test";
import { toFilename } from "./text";

describe("toFilename", () => {
  test("converts spaces to underscores", () => {
    expect(toFilename("My Cool Title")).toBe("my_cool_title");
  });

  test("removes special characters", () => {
    expect(toFilename("What?! A Title...")).toBe("what_a_title");
  });

  test("trims leading and trailing spaces", () => {
    expect(toFilename("   padded title   ")).toBe("padded_title");
  });

  test("handles multiple spaces", () => {
    expect(toFilename("many     spaces here")).toBe("many_spaces_here");
  });

  test("converts uppercase to lowercase", () => {
    expect(toFilename("TITLE IN CAPS")).toBe("title_in_caps");
  });

  test("returns empty string when input is only special characters", () => {
    expect(toFilename("!!!---...")).toBe("");
  });

  test("handles tabs and newlines", () => {
    expect(toFilename("new\nline\ttabbed")).toBe("new_line_tabbed");
  });
});
