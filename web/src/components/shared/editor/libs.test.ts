import { describe, test, expect } from "bun:test";

import {
  LINK_PATTERN,
  IMAGE_PATTERN,
  cs,
  substringSelection,
  wrapSelection,
  appendToText,
} from "./libs";

describe("Cursor utilities", () => {
  describe("cs", () => {
    test("returns {start, end} if end >= start", () => {
      expect(cs(2, 5)).toEqual({ start: 2, end: 5 });
    });

    test("defaults end to start if end is undefined", () => {
      expect(cs(3)).toEqual({ start: 3, end: 3 });
    });

    test("defaults end to start if end < start", () => {
      expect(cs(5, 2)).toEqual({ start: 5, end: 5 });
    });
  });

  describe("substringSelection", () => {
    test("returns start and end of substring if found", () => {
      const text = "hello world";
      const sub = "lo wo";
      expect(substringSelection(text, sub)).toEqual({ start: 3, end: 8 });
    });

    test("returns null if substring not found", () => {
      expect(substringSelection("abc", "zzz")).toBeNull();
    });
  });

  describe("wrapSelection", () => {
    test("wraps selected text with pattern", () => {
      const value = "Click here";
      const selection = { start: 6, end: 10 };
      const result = wrapSelection(selection, value, LINK_PATTERN);
      expect(result).toBe("Click [here](%CURSOR%)");
    });

    test("wraps fallback text when selection is empty", () => {
      const value = "Hello ";
      const selection = { start: 6, end: 6 };
      const result = wrapSelection(selection, value, LINK_PATTERN, "link");
      expect(result).toBe("Hello [link](%CURSOR%)");
    });

    test("returns original text when selection is empty and no fallback", () => {
      const value = "Hello ";
      const selection = { start: 6, end: 6 };
      expect(wrapSelection(selection, value, LINK_PATTERN)).toBe("Hello ");
    });
  });

  describe("appendToText", () => {
    test("appends pattern with fallback replaced", () => {
      const result = appendToText("Test", IMAGE_PATTERN, "desc");
      expect(result).toBe("Test\n![desc](%CURSOR%)\n");
    });

    test("appends pattern with empty fallback", () => {
      const result = appendToText("Test", IMAGE_PATTERN);
      expect(result).toBe("Test\n![](%CURSOR%)\n");
    });
  });
});
