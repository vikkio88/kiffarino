import { startServer } from "../../server";
import { generate } from "./generate";
import { help } from "./help";
import { init } from "./init";

const methods = ["help", "init", "generate", "start"] as const;
export type MethodName = (typeof methods)[number];

export const map: Record<MethodName, (args: string[]) => void> = {
  help,
  init,
  generate,

  start: () => {
    //TODO: maybe check if port is passed and use that instead of default
    // check if folder and rc file are there
    startServer();
  },
};
