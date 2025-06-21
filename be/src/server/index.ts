import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { NAME, SERVER_PORT } from "@kiffarino/shared/config";
import staticHandler from "../static";
import tickets from "./actions/tickets";

const server = new Hono();

server.use(
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

server.get("/health", (c) => {
  return c.json({ up: true });
});

const api = new Hono().basePath("/api");
api.route("/", tickets);

server.route("/", api);

// SPA serving
server.use("/*", staticHandler);

export const startServer = () =>
  serve(
    {
      fetch: server.fetch,
      port: SERVER_PORT,
    },
    (info) => {
      console.log(`${NAME} is running on http://localhost:${info.port}`);
    }
  );
