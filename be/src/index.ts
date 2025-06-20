import { serve } from "@hono/node-server";
import { NAME, SERVER_PORT } from "@kiffarino/shared";
import server from "./server";

serve(
  {
    fetch: server.fetch,
    port: SERVER_PORT,
  },
  (info) => {
    console.log(`${NAME} is running on http://localhost:${info.port}`);
  }
);
