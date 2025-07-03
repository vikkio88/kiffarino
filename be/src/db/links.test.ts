import { describe, test, expect } from "bun:test";
import {
  createLink,
  mergeLinks,
  removeFromLinks,
  removeLink,
  unlinkTickets,
} from "./links";
import { Link } from "@kiffarino/shared";

describe("Link merging and removal", () => {
  test("mergeLinks adds bidirectional links", () => {
    const initial = {};
    const [idA, linkA, idB, linkB] = createLink(
      { id: "A" },
      { id: "B" },
      "blocks"
    );
    const merged = mergeLinks(initial, [idA, linkA, idB, linkB]);

    expect(merged).toEqual({
      A: [new Link("B", "blocks")],
      B: [new Link("A", "blockedBy")],
    });
  });

  test("removeLink removes both directions", () => {
    const [idA, linkA, idB, linkB] = createLink(
      { id: "X" },
      { id: "Y" },
      "linked"
    );
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

describe("unlinkTickets", () => {
  test("removes a 'linked' link between two tickets", () => {
    const [idA, linkA, idB, linkB] = createLink(
      { id: "A" },
      { id: "B" },
      "linked"
    );
    const merged = mergeLinks({}, [idA, linkA, idB, linkB]);
    const updated = unlinkTickets(merged, { id: "A" }, { id: "B" });

    expect(updated).toEqual({
      A: [],
      B: [],
    });
  });

  test("removes a 'blocks' link between two tickets", () => {
    const [idA, linkA, idB, linkB] = createLink(
      { id: "A" },
      { id: "B" },
      "blocks"
    );
    const merged = mergeLinks({}, [idA, linkA, idB, linkB]);
    const updated = unlinkTickets(merged, { id: "A" }, { id: "B" });

    expect(updated).toEqual({
      A: [],
      B: [],
    });
  });

  test("does not remove links to other tickets", () => {
    const link1 = createLink({ id: "X" }, { id: "Y" }, "linked");
    const link2 = createLink({ id: "X" }, { id: "Z" }, "linked");

    let links = mergeLinks({}, link1);
    links = mergeLinks(links, link2);

    const updated = unlinkTickets(links, { id: "X" }, { id: "Y" });

    expect(updated).toEqual({
      X: [new Link("Z", "linked")],
      Y: [],
      Z: [new Link("X", "linked")],
    });
  });

  test("handles missing keys safely", () => {
    const links = {
      A: [new Link("B", "linked")],
      B: [new Link("A", "linked")],
    };

    const updated = unlinkTickets(links, { id: "A" }, { id: "C" });

    expect(updated).toEqual({
      A: [new Link("B", "linked")],
      B: [new Link("A", "linked")],
      C: [],
    });
  });

  describe("removeFromLinks", () => {
    test("removes ticket and reciprocal links", () => {
      const links = {
        A: [new Link("B", "linked"), new Link("C", "blocks")],
        B: [new Link("A", "linked")],
        C: [new Link("A", "blockedBy")],
      };

      const cleaned = removeFromLinks(links, "A");

      expect(cleaned).toEqual({});
    });

    test("removes empty reciprocal entries", () => {
      const links = {
        A: [new Link("B", "linked")],
        B: [new Link("A", "linked")],
      };

      const cleaned = removeFromLinks(links, "A");

      expect(cleaned).toEqual({});
    });

    test("does nothing if ticket has no links", () => {
      const links = {
        A: [],
        B: [new Link("C", "linked")],
        C: [new Link("B", "linked")],
      };

      const cleaned = removeFromLinks(links, "A");

      expect(cleaned).toEqual({
        B: [new Link("C", "linked")],
        C: [new Link("B", "linked")],
      });
    });

    test("handles missing ticket id gracefully", () => {
      const links = {
        A: [new Link("B", "linked")],
        B: [new Link("A", "linked")],
      };

      const cleaned = removeFromLinks(links, "Z");

      expect(cleaned).toEqual({
        A: [new Link("B", "linked")],
        B: [new Link("A", "linked")],
      });
    });
  });
});
