import { type Context } from "hono";
import { serveStatic } from "hono/serve-static";
import fs from "node:fs";
import p from "node:path";
import { fileURLToPath } from "node:url";
import { isDev } from "../libs/env";

const STATIC_FOLDER_NAME = "public";
const INDEX_FILE = "index.html";

function resolvePublicPath(pathInPublic: string) {
  return isDev()
    ? p.resolve(
        getCurrentFilePath(),
        "..",
        "..",
        STATIC_FOLDER_NAME,
        pathInPublic
      )
    : p.resolve(getCurrentFilePath(), STATIC_FOLDER_NAME, pathInPublic);
}

export function getCurrentFilePath() {
  return p.dirname(fileURLToPath(import.meta.url));
}

const staticHandler = serveStatic({
  root: STATIC_FOLDER_NAME,
  getContent: async (path, c: Context) => {
    const resolvedPath = isDev()
      ? p.resolve(getCurrentFilePath(), "..", "..", path)
      : p.resolve(getCurrentFilePath(), path);

    if (!fs.existsSync(resolvedPath)) {
      const isFile = /\.[^\/]+$/.test(path);
      if (isFile) {
        return fs.readFileSync(resolvePublicPath(INDEX_FILE));
      }
      c.status(404);
      return c.text("Not Found");
    }

    return fs.readFileSync(resolvedPath);
  },
});
export default staticHandler;
