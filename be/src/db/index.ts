import path from "node:path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { DB_FILENAME, Link, type TicketRecord } from "@kiffarino/shared";
import { loadConfig } from "../libs/config";

type DBSchema = {
  tickets: TicketRecord[];
  links: Record<string, Link[]>;
  tags: string[];
};

let db: Low<DBSchema>;
export function makeDb() {
  if (!db) {
    const { baseFolder } = loadConfig();
    const file = path.join(baseFolder, DB_FILENAME);
    const adapter = new JSONFile<DBSchema>(file);
    const defaultData: DBSchema = {
      tickets: [],
      links: {},
      tags: [],
    };

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
