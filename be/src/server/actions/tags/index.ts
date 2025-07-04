import { Hono } from "hono";
import { filter } from "./filter";
import { add } from "./add";

const tags = new Hono().basePath("/tags");
tags.get("/", filter);
tags.post("/", add);

export default tags;
