import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { NAME, SERVER_PORT } from "@kiffarino/shared/config";
import staticHandler from "../static";
import tickets from "./actions/tickets";
import assets from "./actions/assets";
import tags from "./actions/tags";

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
api.route("/", assets);
api.route("/", tags);

api.all("*", (c) => c.json({}, 400));

server.route("/", api);

// SPA & Static Assets serving
server.use("/*", staticHandler);

export const startServer = (forcedPort?: number) => {
  if (forcedPort) {
    console.log(
      `⚠️ forced port specified, trying running on port ${forcedPort}.`
    );
  }

  serve(
    {
      fetch: server.fetch,
      port: forcedPort || SERVER_PORT,
    },
    (info) => {
      console.log(`${NAME} is running on http://localhost:${info.port}`);
    }
  );

  // Graceful shutdown on Ctrl+C
  process.on("SIGINT", () => {
    console.log("\n🛑 Received SIGINT. Shutting down...");
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\n🛑 Received SIGTERM. Shutting down...");
    process.exit(0);
  });
};
