const methods = ["help", "init"] as const;
export type MethodName = (typeof methods)[number];

export const map: Record<MethodName, (args: string[]) => void> = {
  help: () => console.log("help"),
  init: () => console.log("init"),
};
