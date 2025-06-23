import { Hono } from "hono";
import { create } from "./create";
import { filter } from "./filter";
import { getOne } from "./getOne";
import { del } from "./del";
import { update } from "./update";

const tickets = new Hono().basePath("/tickets");
tickets.get("/", filter);
tickets.get("/:id", getOne);

tickets.put("/:id", update);
//TODO: Implement
tickets.put("/:id/move", getOne);


tickets.delete("/:id", del);
tickets.post("/", create);

export default tickets;
