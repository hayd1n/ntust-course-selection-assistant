import { Body, Client, ResponseType } from "@tauri-apps/api/http";
import type { Course } from "./course";

const API_URL = "https://querycourse.ntust.edu.tw/querycourse/api";

export enum SearchBy {
  CourseNo,
  CourseName,
  CourseTeacher,
}

export enum SearchLang {
  zh = "zh",
  en = "en",
}

export async function sendSearch(
  client: Client,
  semester: string,
  text: string,
  type: SearchBy,
  language: SearchLang
) {
  if (client === null) return null;

  let response = await client.post<Course[]>(
    `${API_URL}/courses`,
    Body.json({
      CourseName: type === SearchBy.CourseName ? text : "",
      CourseNo: type === SearchBy.CourseNo ? text : "",
      CourseNotes: "",
      CourseTeacher: type === SearchBy.CourseTeacher ? text : "",
      Dimension: "",
      ForeignLanguage: 0,
      Language: language.toString(),
      OnleyNTUST: 0,
      OnlyGeneral: 0,
      OnlyMaster: 0,
      OnlyNode: 0,
      OnlyUnderGraduate: 0,
      Semester: semester,
    }),
    {
      responseType: ResponseType.JSON,
    }
  );

  return response.data;
}

export async function searchCourse(
  client: Client,
  text: string,
  language: SearchLang
) {
  const searchByNo =
    (await sendSearch(client, "1122", text, SearchBy.CourseNo, language)) ?? [];
  const searchByName =
    (await sendSearch(client, "1122", text, SearchBy.CourseName, language)) ??
    [];
  const searchByTeacher =
    (await sendSearch(
      client,
      "1122",
      text,
      SearchBy.CourseTeacher,
      language
    )) ?? [];

  const combine = [...searchByNo, ...searchByName, ...searchByTeacher];

  const uniqueCourses: Course[] = Object.values(
    combine.reduce((acc: { [key: string]: Course }, course: Course) => {
      console.log(course, acc);
      if (acc.hasOwnProperty(course.CourseNo))
        acc[course.CourseNo].Node += `,${course.Node}`;
      else acc[course.CourseNo] = course;
      return acc;
    }, {})
  );

  return uniqueCourses;
}
