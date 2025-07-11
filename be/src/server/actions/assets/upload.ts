import type { Context } from "hono";

import { upload as uploadFile } from "../../../db/assets";
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
  const result = await uploadFile(baseFolder, LOCAL_ASSETS_FOLDER, file);

  return c.json<ApiResult<StaticAssetFile>>({ result }, 201);
}
