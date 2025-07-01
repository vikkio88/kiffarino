import { Hono } from "hono";
import { create } from "./create";
import { filter } from "./filter";
import { getOne } from "./getOne";
import { del } from "./del";
import { update } from "./update";
import { move } from "./move";
import { board } from "./board";
import { archive } from "./archive";

const tickets = new Hono().basePath("/tickets");
tickets.get("/board", board);
tickets.get("/", filter);
tickets.get("/:id", getOne);
tickets.put("/:id/move", move);
tickets.put("/:id", update);
tickets.post("/:id/archive", archive);

//TODO: Implement
tickets.put("/:id/link", getOne);

tickets.delete("/:id", del);
tickets.post("/", create);

export default tickets;
