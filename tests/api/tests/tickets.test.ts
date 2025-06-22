import { describe, test, expect } from "bun:test";
import { post } from "../libs/http";
import { TICKETS_URL } from "./conf";
import { parse } from "../libs/resp";

describe("Tickets", () => {
  test("create", async () => {
    const res = await post(TICKETS_URL, { title: "ciao" });
    expect(res.status).toBe(201);

    const ticket = await parse<{ result: { title: string } }>(res);

    expect(ticket?.result?.title).toBe("ciao");
  });
});
