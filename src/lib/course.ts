export type Week = {
  label: string;
  text: string;
};

export const weeks: Week[] = [
  { label: "M", text: "Monday" },
  { label: "T", text: "Tuesday" },
  { label: "W", text: "Wednesday" },
  { label: "R", text: "Thursday" },
  { label: "F", text: "Friday" },
  { label: "S", text: "Saturday" },
  { label: "U", text: "Sunday" },
];

export type ClassTime = {
  label: string;
  start: string;
  end: string;
};

export const classTimes: ClassTime[] = [
  {
    label: "1",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "2",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "3",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "4",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "5",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "6",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "7",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "8",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "9",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "10",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "A",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "B",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "C",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "D",
    start: "08:10",
    end: "09:00",
  },
];

export type Course = {
  Semester: string;
  CourseNo: string;
  CourseName: string;
  CourseTeacher: string;
  Dimension: string;
  CreditPoint: string;
  RequireOption: string;
  AllYear: string;
  ChooseStudent: number;
  Restrict1: string;
  Restrict2: string;
  ThreeStudent: number;
  AllStudent: number;
  NTURestrict: string;
  NTNURestrict: string;
  CourseTimes: string;
  PracticalTimes: string;
  ClassRoomNo: string;
  ThreeNode: string | null;
  Node: string;
  Contents: string;
  NTU_People: number;
  NTNU_People: number;
  AbroadPeople: number;
};

export interface CourseInfo {
  semester: string;
  courseNo: string;
  courseName: string;
  courseTeacher: string;
  dimension: string;
  creditPoint: number;
  requireOption: string;
  allYear: string;
  chooseStudent: number;
  restrict1: number;
  restrict2: number;
  threeStudent: number;
  allStudent: number;
  ntuRestrict: number;
  ntnuRestrict: number;
  courseTimes: string;
  practicalTimes: string;
  classRoomNo?: string;
  threeNode?: string;
  node?: string;
  contents: string;
  ntuPeople: number;
  ntnuPeople: number;
  cbroadPeople: number;
}

export interface CourseDetails {
  semester: string;
  courseNo: string;
  courseName: string;
  courseTeacher: string;
  creditPoint: number;
  courseTimes: number;
  practicalTimes: number;
  requireOption: string;
  allYear: string;
  chooseStudent: number;
  threeStudent: number;
  allStudent: number;
  restrict1: number;
  restrict2: number;
  ntuRestrict: number;
  ntnuRestrict?: number;
  classRoomNo?: string;
  coreAbility?: string;
  courseUrl?: string;
  courseObject?: string;
  courseContent?: string;
  courseTextbook?: string;
  courseRefbook?: string;
  courseNote?: string;
  courseGrading?: string;
  courseRemark?: string;
  instruction1?: number;
  instruction2?: number;
  instruction3?: number;
  instruction4?: number;
  instructionOther?: string;
}

export function parseTimeString(node: string) {
  let times = node.split(",");

  return times.map((t) => {
    let weekChar = t[0];
    let timeChar = t[1];

    let week = weeks.find((w) => w.label === weekChar);
    let time = classTimes.find((t) => t.label === timeChar);

    if (week && time) {
      return { week, time };
    } else {
      return null;
    }
  });
}
