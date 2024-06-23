import { writable } from "svelte/store";
import type { CourseInfo } from "./course";

export const uiSidemenuWidth = writable<number>(192);

export const pageSearchSelectedCourseNo = writable<string | null>(null);

export const searchText = writable<string>("");
export const searchResult = writable<CourseInfo[]>([]);

export const currentCourse = writable<CourseInfo | null>(null);
