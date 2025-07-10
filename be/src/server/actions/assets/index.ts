import { Hono } from "hono";
import { list } from "./list";
import { upload } from "./upload";

const assets = new Hono().basePath("/assets");

assets.get("/", list);
assets.post("/", upload);

export default assets;
