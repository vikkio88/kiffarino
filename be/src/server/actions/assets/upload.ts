import type { Context } from "hono";
import path from "node:path";
import { writeFile } from "fs/promises";
import { loadConfig } from "../../../libs/config";
import {
  LOCAL_ASSETS_FOLDER,
  type ApiResult,
  type StaticAssetFile,
} from "@kiffarino/shared";

export async function upload(c: Context) {
  const formData = await c.req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return c.json({ error: "No file uploaded" }, 422);
  }

  const { baseFolder } = loadConfig();
  const localAssetPath = path.resolve(baseFolder, LOCAL_ASSETS_FOLDER);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filePath = path.join(localAssetPath, file.name);

  await writeFile(filePath, buffer);

  const result: StaticAssetFile = {
    name: file.name,
    path: filePath,
    url: path.join("/", LOCAL_ASSETS_FOLDER, file.name),
    extension: path.extname(file.name).slice(1),
    size: buffer.length,
    modified: Date.now(),
  };

  return c.json<ApiResult<StaticAssetFile>>({ result }, 201);
}
