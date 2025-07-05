import { generate } from "./generate";
import { help } from "./help";
import { init } from "./init";
import { start } from "./start";
import { version } from "./version";

const methods = ["help", "init", "generate", "start", "version"] as const;
export type MethodName = (typeof methods)[number];

export const map: Record<MethodName, (args: string[]) => void> = {
  help,
  init,
  generate,
  version,
  start,
};
