import { goto } from "$app/navigation";
import { currentCourse, pageSearchSelectedCourseNo } from "./context";
import type { CourseInfo } from "./course";
import { setStateSelectedTable } from "./storage";

export function gotoCourse(course: CourseInfo) {
  console.log("goto course", course);
  pageSearchSelectedCourseNo.set(course.courseNo);
  currentCourse.set(course);
  goto(`/search/view?no=${course.courseNo}`);
}

export async function gotoTable(name: string) {
  await setStateSelectedTable(name);
  goto(`/tables/table?name=${name}`);
}
