import fs from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { isDev } from "../../libs/env";

interface PackageJson {
  version: string;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

function getVersion(): string {
  const pathToPackageJson = isDev()
    ? join(__dirname, "..", "..", "..", "..", "package.json")
    : join(__dirname, "package.json");

  try {
    const content = fs.readFileSync(pathToPackageJson, "utf8");
    const pkg = JSON.parse(content) as PackageJson;
    return pkg.version;
  } catch (err) {
    console.error("Failed to read package.json:", err);
    return "unknown";
  }
}

export default function version() {
  console.log(`v ${getVersion()}`);
}
