import { LOCAL_ASSETS_FOLDER, type StaticAssetFile } from "@kiffarino/shared";
import fs from "node:fs";
import { writeFile } from "node:fs/promises";
import p from "node:path";

export function list(
  baseFolder: string,
  assetsFolder: string
): StaticAssetFile[] {
  const localAssetPath = p.resolve(baseFolder, assetsFolder);

  if (!fs.existsSync(localAssetPath)) return [];

  return fs.readdirSync(localAssetPath).flatMap((file) => {
    const fullPath = p.join(localAssetPath, file);
    const stat = fs.statSync(fullPath);

    const name = p.basename(file);

    if (stat.isFile()) {
      return {
        name,
        path: fullPath,
        url: p.join("/", LOCAL_ASSETS_FOLDER, name),
        extension: p.extname(file).slice(1),
        size: stat.size,
        modified: stat.mtime.getTime(),
      };
    }

    return [];
  });
}

export async function upload(
  baseFolder: string,
  assetsFolder: string,
  file: File
): Promise<StaticAssetFile> {
  const localAssetPath = p.resolve(baseFolder, assetsFolder);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filePath = p.join(localAssetPath, file.name);

  await writeFile(filePath, buffer);

  return {
    name: file.name,
    path: filePath,
    url: p.join("/", LOCAL_ASSETS_FOLDER, file.name),
    extension: p.extname(file.name).slice(1),
    size: buffer.length,
    modified: Date.now(),
  };
}
