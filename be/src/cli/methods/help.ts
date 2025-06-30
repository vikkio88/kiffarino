import { EXEC_NAME, NAME, PROJECT_CONFIG_FILENAME } from "@kiffarino/shared/config";

export function help() {
  console.log(`
${NAME} — your local project management tool

https://github.com/vikkio88/kiffarino

Available commands:

  init         Create a ${PROJECT_CONFIG_FILENAME} config file in the current directory
  generate     Scaffold the project folder defined in ${PROJECT_CONFIG_FILENAME} (e.g. config, tickets/)
  start        Launch the local web UI to browse and manage your tickets
  
  version      print the \`kfr\` cli version.

Usage:

  ${EXEC_NAME} <command> [options]

Examples:

  ${EXEC_NAME} init
  ${EXEC_NAME} generate
  ${EXEC_NAME} start
`);
}
