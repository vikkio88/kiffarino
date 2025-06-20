import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { serveStatic } from "hono/serve-static";
import { SERVER_PORT } from "@kiffarino/shared";
import fs from "node:fs";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3003",
      "http://localhost:5173",
      "http://localhost:5555",
    ],
  })
);

app.get("/health", (c) => {
  return c.json({ up: true });
});

app.use(
  "/*",
  serveStatic({
    root: "./public/",
    getContent: async (path, c: Context) => {
      //TODO: investigate if I can send a stream
      return fs.readFileSync(path);
    },
  })
);

serve(
  {
    fetch: app.fetch,
    port: SERVER_PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
