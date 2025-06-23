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

  start: (args: string[]) => {
    const forcedPort = args[0] ? parseInt(args[0]) : undefined;
    startServer(forcedPort);
  },
};
