import { describe, expect, test } from "bun:test";
import { upsertMultiTags } from "./tags";

describe("upsertMultiTags", () => {
  test("adds a single new tag", () => {
    const [all, added] = upsertMultiTags(["Frontend"], []);
    expect(all).toEqual(["frontend"]);
    expect(added).toEqual(["frontend"]);
  });

  test("adds multiple new tags", () => {
    const [all, added] = upsertMultiTags(["Dev Ops", "UX!"], ["api"]);
    expect(all.sort()).toEqual(["api", "dev-ops", "ux"]);
    expect(added.sort()).toEqual(["dev-ops", "ux"]);
  });

  test("ignores duplicates", () => {
    const [all, added] = upsertMultiTags(["API", "api"], ["api"]);
    expect(all).toEqual(["api"]);
    expect(added).toEqual([]);
  });

  test("normalizes formatting", () => {
    const [all, added] = upsertMultiTags([" Back end "], []);
    expect(all).toEqual(["back-end"]);
    expect(added).toEqual(["back-end"]);
  });
});
