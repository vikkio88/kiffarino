import { type Context } from "hono";
import { serveStatic } from "hono/serve-static";
import fs from "node:fs";
import p from "node:path";
import { fileURLToPath } from "node:url";
import { isDev } from "../libs/env";
import { loadConfig } from "../libs/config";
import { LOCAL_ASSETS_FOLDER } from "@kiffarino/shared";

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
  getContent: async (path: string, c: Context) => {
    const urlPath = c.req.path;
    const isFile = p.extname(urlPath) !== "";

    // check for file in the project assets
    if (isFile && path.includes(LOCAL_ASSETS_FOLDER)) {
      const { baseFolder } = loadConfig();
      const localAssetPath = p.resolve(baseFolder, LOCAL_ASSETS_FOLDER);
      const relativePath = path.replace(/^(public\/|static\/)+/, "");
      const fullAssetPath = p.join(localAssetPath, relativePath);
      if (fs.existsSync(fullAssetPath)) {
        return fs.readFileSync(fullAssetPath);
      }
    }

    const resolvedPath = isDev()
      ? p.resolve(getCurrentFilePath(), "..", "..", path)
      : p.resolve(getCurrentFilePath(), path);

    if (!fs.existsSync(resolvedPath)) {
      if (isFile) {
        c.status(404);
        return c.text("Not Found");
      }
      
      return fs.readFileSync(resolvePublicPath(INDEX_FILE));
    }

    return fs.readFileSync(resolvedPath);
  },
});
export default staticHandler;
