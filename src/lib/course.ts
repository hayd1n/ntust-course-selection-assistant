export type Week = {
  label: string;
  text: string;
};

export const Weeks: Week[] = [
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

export const ClassTimes: ClassTime[] = [
  {
    label: "1",
    start: "08:10",
    end: "09:00",
  },
  {
    label: "2",
    start: "09:10",
    end: "10:00",
  },
  {
    label: "3",
    start: "10:20",
    end: "11:10",
  },
  {
    label: "4",
    start: "11:20",
    end: "12:10",
  },
  {
    label: "5",
    start: "12:20",
    end: "13:10",
  },
  {
    label: "6",
    start: "13:20",
    end: "14:10",
  },
  {
    label: "7",
    start: "14:20",
    end: "15:10",
  },
  {
    label: "8",
    start: "15:30",
    end: "16:20",
  },
  {
    label: "9",
    start: "16:30",
    end: "17:20",
  },
  {
    label: "10",
    start: "17:30",
    end: "18:20",
  },
  {
    label: "A",
    start: "18:25",
    end: "19:15",
  },
  {
    label: "B",
    start: "19:20",
    end: "20:10",
  },
  {
    label: "C",
    start: "20:15",
    end: "21:05",
  },
  {
    label: "D",
    start: "21:10",
    end: "22:00",
  },
];

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

export interface WeekRange {
  weekIndex: number;
  startIndex: number;
  endIndex: number;
}

export function parseWeekRanges(input: string) {
  const ranges: WeekRange[] = [];
  const elements = input.split(",");

  // use a Map to store the values for each week
  const weekMap: { [key: string]: string[] } = {};

  // grouping elements into weekMap
  for (const element of elements) {
    const week = element[0];
    const value = element.slice(1);

    if (!weekMap[week]) {
      weekMap[week] = [];
    }
    weekMap[week].push(value);
  }

  // find week and class time indexes
  const getWeekIndex = (label: string) =>
    Weeks.findIndex((week) => week.label === label);

  const getClassTimeIndex = (label: string) =>
    ClassTimes.findIndex((time) => time.label === label);

  // iterate over weekMap and generate ranges
  for (const week in weekMap) {
    const values = weekMap[week];
    // 將 values 按字母和數字順序排序
    values.sort((a, b) =>
      getClassTimeIndex(a) > getClassTimeIndex(b) ? 1 : -1
    );
    // console.log(values);

    // group the sorted values into ranges
    let start = values[0];
    for (let i = 1; i < values.length; i++) {
      const prevValue = values[i - 1];
      const currValue = values[i];
      const prevNum = getClassTimeIndex(prevValue);
      const currNum = getClassTimeIndex(currValue);
      if (currNum !== prevNum + 1) {
        ranges.push({
          weekIndex: getWeekIndex(week),
          startIndex: getClassTimeIndex(start),
          endIndex: getClassTimeIndex(values[i - 1]),
        });
        start = values[i];
      }
    }
    ranges.push({
      weekIndex: getWeekIndex(week),
      startIndex: getClassTimeIndex(start),
      endIndex: getClassTimeIndex(values[values.length - 1]),
    });
  }

  return ranges;
}
