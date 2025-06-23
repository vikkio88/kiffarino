import path from "node:path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { DB_FILENAME } from "@kiffarino/shared";
import { loadConfig } from "../libs/config";
import type { TicketRecord } from "./tickets";

type DBSchema = {
  tickets: TicketRecord[];
};

let db: Low<DBSchema>;
export function makeDb() {
  if (!db) {
    const { baseFolder } = loadConfig();
    const file = path.join(baseFolder, DB_FILENAME);
    const adapter = new JSONFile<DBSchema>(file);
    const defaultData: DBSchema = { tickets: [] };

    db = new Low<DBSchema>(adapter, defaultData);
  }

  return db;
}

export async function migrate() {
  await makeDb().read();
  await makeDb().write();
}

export async function read() {
  await makeDb().read();
  return makeDb().data!;
}

export async function write() {
  await makeDb().write();
}

export default makeDb;
