import type { Context } from "hono";
import { list as ls } from "../../../db/assets";
import { loadConfig } from "../../../libs/config";
import { LOCAL_ASSETS_FOLDER } from "@kiffarino/shared";

export function list(c: Context) {
  const { baseFolder } = loadConfig();
  return c.json(ls(baseFolder, LOCAL_ASSETS_FOLDER));
}
