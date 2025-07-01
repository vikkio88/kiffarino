import { expect, test } from "bun:test";
import * as fs from "node:fs";
import path from "node:path";

import { init } from "./methods/init";
import { help } from "./methods/help";
import { getVersion } from "./methods/version";
import { header } from "./methods/shared";
import { generate } from "./methods/generate";
import { version } from "./methods/version";

const PROJECT_CONFIG_FILENAME = "kiffarino.config.json";
const TEST_CONFIG_PATH = path.resolve(".", PROJECT_CONFIG_FILENAME);

function spyOnConsole(method: "log" | "error" | "warn") {
  const originalConsole = globalThis.console;
  const calls: any[][] = [];

  globalThis.console = new Proxy(originalConsole, {
    get(target, prop) {
      if (prop === method) {
        return (...args: any[]) => {
          calls.push(args);
        };
      }
      return Reflect.get(target, prop);
    },
  });

  return {
    calls,
    restore() {
      globalThis.console = originalConsole;
    },
  };
}

test("init with existing config without --force exits", () => {
  fs.writeFileSync(TEST_CONFIG_PATH, "{}");

  const errorSpy = spyOnConsole("error");

  const originalExit = process.exit;
  let exitCode: number | null = null;
  (process as any).exit = (code?: number) => {
    exitCode = code ?? 0;
    throw new Error("process.exit called");
  };

  try {
    expect(() => init([])).toThrow("process.exit called");
  } finally {
    errorSpy.restore();
    (process as any).exit = originalExit;
    fs.rmSync(TEST_CONFIG_PATH);
  }

  expect(
    errorSpy.calls.some((call) =>
      call.some(
        (arg) => typeof arg === "string" && arg.includes("already initialized")
      )
    )
  ).toBe(true);

  expect(exitCode!).toBe(1);
});

test("help outputs expected commands", () => {
  const logSpy = spyOnConsole("log");
  help();
  expect(
    logSpy.calls.some((call) =>
      call.some(
        (arg) => typeof arg === "string" && arg.includes("Available commands:")
      )
    )
  ).toBe(true);
  logSpy.restore();
});

test("init", () => {
  const logSpy = spyOnConsole("log");
  init(["-f"]);
  expect(
    logSpy.calls.some((call) => {
      console.log(call);
      return call.some(
        (arg) => typeof arg === "string" && arg.includes("scaffold")
      );
    })
  ).toBe(true);
  logSpy.restore();
});

test("generate", () => {
  const logSpy = spyOnConsole("log");
  generate(["-f"]);
  expect(
    logSpy.calls.some((call) => {
      console.log(call);
      return call.some(
        (arg) =>
          typeof arg === "string" && arg.includes("Project folders created")
      );
    })
  ).toBe(true);
  logSpy.restore();
});

test("version", () => {
  const v = getVersion();
  const logSpy = spyOnConsole("log");
  version();
  expect(
    logSpy.calls.some((call) => {
      console.log(call);
      return call.some((arg) => typeof arg === "string" && arg.includes(v));
    })
  ).toBe(true);
  logSpy.restore();
});

test("getVersion returns non-empty string", () => {
  const v = getVersion();
  expect(typeof v).toBe("string");
  expect(v.length).toBeGreaterThan(0);
});

test("header includes name and version", () => {
  const h = header();
  expect(h).toContain("your local project management tool");
  expect(h).toMatch(/v\d+\.\d+\.\d+/);
});
