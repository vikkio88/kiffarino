import { type Context } from "hono";
import { serveStatic } from "hono/serve-static";
import fs from "node:fs";

const STATIC_FILES_FOLDER = "./public/";

const staticHandler = serveStatic({
  root: STATIC_FILES_FOLDER,
  getContent: async (path, c: Context) => {
    //TODO: investigate if I can send a stream
    if (!fs.existsSync(path)) {
      c.status(404);
      return c.text("Not Found");
    }

    return fs.readFileSync(path);
  },
});

export default staticHandler;
