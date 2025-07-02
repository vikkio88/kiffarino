import { Hono } from "hono";
import { list } from "./list";

const assets = new Hono().basePath("/assets");
assets.get("/", list);

export default assets;
