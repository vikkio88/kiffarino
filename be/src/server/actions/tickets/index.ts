import { Hono } from "hono";
import { create } from "./create";

const tickets = new Hono().basePath("/tickets");
tickets.post("/", create);

export default tickets;
