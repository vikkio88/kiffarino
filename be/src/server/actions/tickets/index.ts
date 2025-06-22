import { Hono } from "hono";
import { create } from "./create";
import { filter } from "./filter";

const tickets = new Hono().basePath("/tickets");
tickets.get("/", filter);
tickets.post("/", create);

export default tickets;
