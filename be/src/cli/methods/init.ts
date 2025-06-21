import { EXEC_NAME, PROJECT_CONFIG_FILENAME } from "@kiffarino/shared/config";
import fs from "node:fs";
import path from "node:path";

type ProjectConfig = {
  name: string;
  baseFolder: string;
};

export function init(args: string[]) {
  const force = args.includes("-f") || args.includes("--force");
  const configPath = path.resolve(".", PROJECT_CONFIG_FILENAME);

  if (fs.existsSync(configPath) && !force) {
    console.error(
      `⚠️  Project already initialized. Use --force to overwrite.\nFile: ${configPath}`
    );
    process.exit(1);
  }

  const config: ProjectConfig = baseProjectConfig();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`✅ Project initialized at ${configPath}`);
  console.log(`Run \`${EXEC_NAME} generate\` to scaffold your project.`);
}

function baseProjectConfig(): ProjectConfig {
  const cwd = process.cwd();
  const folderName = path.basename(cwd);

  return {
    name: folderName,
    baseFolder: "./kfr-project",
  };
}
