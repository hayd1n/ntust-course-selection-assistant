import { Store } from "tauri-plugin-store-api";
import type { CourseInfo } from "./course";
import { getVersion } from "@tauri-apps/api/app";

const state = new Store("state.json");

export async function setStateSelectedTable(name: string) {
  await state.set("pageTableSelectedName", name);
}

export async function getStateSelectedTable() {
  return await state.get<string>("pageTableSelectedName");
}

export async function setStateSidemenuWidth(width: number) {
  await state.set("uiSidemenuWidth", width);
}

export async function getStateSidemenuWidth() {
  return await state.get<number>("uiSidemenuWidth");
}

export interface Table {
  name: string;
  courses: CourseInfo[];
  updatedAt: Date;
}

const tables = new Store("tables.json");

export async function getStoreAllTables() {
  // Due to a bug in the tauri-plugin-store-api,
  // this trick is needed here to convert the data to the correct Map type.
  return await tables.get<Table[]>("tables");
}

export async function getStoreTable(name: string) {
  const all = await getStoreAllTables();
  return all?.find((t) => t.name === name);
}

export async function getStoreTableIndex(name: string) {
  const all = await getStoreAllTables();
  return all?.findIndex((t) => t.name === name);
}

export async function newStoreTable(table: Table) {
  let all = await getStoreAllTables();

  // initialize the table if it has not been created yet.
  if (!all) all = new Array<Table>();

  all.push(table);

  // write updated tables back
  await tables.set("tables", all);

  return true;
}

export async function setStoreTable(index: number, table: Table) {
  let all = await getStoreAllTables();

  // initialize the table if it has not been created yet.
  if (all === null) all = new Array<Table>();

  if (all.at(index) === undefined) return false;

  all[index] = table;

  // write updated tables back
  await tables.set("tables", all);

  return true;
}

export async function insertStoreTable(index: number, table: Table) {
  let all = await getStoreAllTables();

  // initialize the table if it has not been created yet.
  if (all === null) all = new Array<Table>();

  const newAll = [...all.slice(0, index), table, ...all.slice(index)];

  // write updated tables back
  await tables.set("tables", newAll);

  return true;
}

export async function deleteStoreTable(index: number) {
  if (index < 0) return false;

  let all = await getStoreAllTables();
  if (!all?.at(index)) return false;

  all.splice(index, 1);

  // write updated tables back
  await tables.set("tables", all);

  return true;
}

export async function saveTables() {
  // save with app version
  const appVersion = await getVersion();
  await tables.set("version", appVersion);

  return await tables.save();
}
