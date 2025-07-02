import { describe, test, expect } from "bun:test";
import { createLink, mergeLinks, removeLink } from "./links";
import { Link } from "@kiffarino/shared";

describe("Link merging and removal", () => {
  test("mergeLinks adds bidirectional links", () => {
    const initial = {};
    const [idA, linkA, idB, linkB] = createLink({ id: "A" }, { id: "B" }, "blocks");
    const merged = mergeLinks(initial, [idA, linkA, idB, linkB]);

    expect(merged).toEqual({
      A: [new Link("B", "blocks")],
      B: [new Link("A", "blockedBy")],
    });
  });

  test("removeLink removes both directions", () => {
    const [idA, linkA, idB, linkB] = createLink({ id: "X" }, { id: "Y" }, "linked");
    const links = mergeLinks({}, [idA, linkA, idB, linkB]);

    const cleaned = removeLink(links, [idA, linkA, idB, linkB]);

    expect(cleaned).toEqual({
      X: [],
      Y: [],
    });
  });

  test("removeLink doesn't touch unrelated links", () => {
    const link1 = createLink({ id: "1" }, { id: "2" }, "linked");
    const link2 = createLink({ id: "1" }, { id: "3" }, "blocks");

    let links = mergeLinks({}, link1);
    links = mergeLinks(links, link2);

    const updated = removeLink(links, link1);

    expect(updated).toEqual({
      "1": [new Link("3", "blocks")],
      "3": [new Link("1", "blockedBy")],
      "2": [],
    });
  });
});