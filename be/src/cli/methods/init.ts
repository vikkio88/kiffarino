import { EXEC_NAME, PROJECT_CONFIG_FILENAME } from "@kiffarino/shared/config";
import fs from "node:fs";
import path from "node:path";
import type { ProjectConfig } from "../../libs/config";
import { C } from "../../libs/colours";

export function init(args: string[]) {
  const force = args.includes("-f") || args.includes("--force");
  const configPath = path.resolve(".", PROJECT_CONFIG_FILENAME);

  if (fs.existsSync(configPath) && !force) {
    console.error(
      `${C.cR("⚠️  Project already initialized.")} ${C.i(
        "Use --force to overwrite."
      )}\n${C.b("File:")} ${configPath}`
    );
    process.exit(1);
  }

  const config: ProjectConfig = baseProjectConfig();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log(`${C.cG("✅ Project initialized at")} ${C.b(configPath)}`);
  console.log(
    `Run ${C.b("`" + EXEC_NAME + " generate`")} ${C.i(
      "to scaffold your project."
    )}`
  );
}

function baseProjectConfig(): ProjectConfig {
  const cwd = process.cwd();
  const folderName = path.basename(cwd);

  return {
    name: folderName,
    baseFolder: "./kfr-project",
  };
}
