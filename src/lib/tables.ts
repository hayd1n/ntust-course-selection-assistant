import type { CourseInfo } from "./course";
import {
  deleteStoreTable,
  getStoreAllTables,
  getStoreTable,
  getStoreTableIndex,
  insertStoreTable,
  newStoreTable,
  saveTables,
  setStoreTable,
  type Table,
} from "./storage";
import { getCopyNumber, replaceCopyNumber } from "./utils-2";

export const TableNameMaxLength = 25;

export class TableAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`${name} already exists`);
  }
}

export class TableNotFoundError extends Error {
  constructor(name: string) {
    super(`${name} does not exist`);
  }
}

export class CourseNotFoundError extends Error {
  constructor(table: string, courseNo: string) {
    super(`${courseNo} are not in ${table}`);
  }
}

export async function createTable(name: string) {
  const all = await getStoreAllTables();
  if (all?.find((t) => t.name === name) !== undefined)
    throw new TableAlreadyExistsError(name);

  const table: Table = {
    name,
    courses: [],
    updatedAt: new Date(),
  };

  await newStoreTable(table);

  // write the table to the disk immediately
  await saveTables();
}

export async function addCourseToTable(name: string, course: CourseInfo) {
  const index = await getStoreTableIndex(name);
  let table = await getStoreTable(name);
  if (index === undefined || table === undefined)
    throw new TableNotFoundError(name);

  table.courses.push(course);
  table.updatedAt = new Date();

  await setStoreTable(index, table);

  // write the table to the disk immediately
  await saveTables();
}

export async function getTableCourses(name: string) {
  const table = await getStoreTable(name);
  if (table === undefined) throw new TableNotFoundError(name);

  return table.courses;
}

export async function renameTable(oldName: string, newName: string) {
  const index = await getStoreTableIndex(oldName);
  let table = await getStoreTable(oldName);
  if (index === undefined || table === undefined)
    throw new TableNotFoundError(oldName);

  const newNameTable = await getStoreTable(newName);
  if (newNameTable !== undefined) throw new TableAlreadyExistsError(newName);

  table.name = newName;

  await setStoreTable(index, table);

  // write the table to the disk immediately
  await saveTables();
}

export async function duplicateTable(name: string) {
  const index = await getStoreTableIndex(name);
  let table = await getStoreTable(name);
  if (index === undefined || table === undefined)
    throw new TableNotFoundError(name);

  const newTableName = await duplicateTableHelper(table, index + 1, table.name);

  // write the table to the disk immediately
  await saveTables();

  return newTableName;
}

async function duplicateTableHelper(
  table: Table,
  insertIndex: number,
  dstName: string
) {
  const copyNumber = getCopyNumber(dstName);
  const newName =
    copyNumber !== null
      ? replaceCopyNumber(dstName, copyNumber + 1)
      : `${dstName} copy`;

  // if the new table already exists,
  // the lookup continues down the list.
  const dstNameTable = await getStoreTable(newName);
  if (dstNameTable !== undefined) {
    const index = await getStoreTableIndex(newName);
    return await duplicateTableHelper(table, index! + 1, newName);
  }

  table.name = newName;

  await insertStoreTable(insertIndex, table);

  return newName;
}

export async function deleteTable(name: string) {
  const index = await getStoreTableIndex(name);
  if (index === undefined) throw new TableNotFoundError(name);

  await deleteStoreTable(index);

  // write the table to the disk immediately
  await saveTables();
}

export async function deleteTableCourse(name: string, courseNo: string) {
  let table = await getStoreTable(name);
  const tableIndex = await getStoreTableIndex(name);
  if (table === undefined || tableIndex === undefined)
    throw new TableNotFoundError(name);

  const courseIndex = table.courses.findIndex((c) => c.courseNo === courseNo);
  if (courseIndex === -1) throw new CourseNotFoundError(name, courseNo);

  table.courses.splice(courseIndex, 1);

  await setStoreTable(tableIndex, table);

  // write the table to the disk immediately
  await saveTables();
}
