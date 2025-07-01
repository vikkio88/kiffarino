import { EXEC_NAME, PROJECT_CONFIG_FILENAME } from "@kiffarino/shared/config";
import { C } from "../../libs/colours";
import { header } from "./shared";

export function help() {
  console.log(`
${header()}
${C.cB("https://github.com/vikkio88/kiffarino")}

${C.u("Available commands:")}

  ${C.b("init")}       Create a ${C.b(PROJECT_CONFIG_FILENAME)} config file in the current directory
  ${C.b("generate")}   Scaffold the project folder defined in ${C.b(PROJECT_CONFIG_FILENAME)} (e.g. config, tickets/)
  ${C.b("start")}      Launch the local web UI to browse and manage your tickets
  ${C.b("version")}    Print the CLI version

${C.u("Usage:")}

  ${C.b(EXEC_NAME)} <command> [options]

${C.u("Example flow:")}

  1. ${C.b("cd yourProjectFolder/")}
  2. ${C.b(EXEC_NAME)} init        ${C.i("-- creates the config file")}
  3. ${C.b(EXEC_NAME)} generate   ${C.i("-- generates the folder structure")}
  4. ${C.b(EXEC_NAME)} start      ${C.i("-- starts the Web UI")}

  After that, simply run:
    ${C.b(EXEC_NAME)} start
  to manage your tickets.

`);
}
