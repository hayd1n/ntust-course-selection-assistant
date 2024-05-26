import { classTimes, weeks, type ClassTime, type Week } from "./course";
import type { CourseBlockPos } from "./courseblock";

export function getCoursePosition(
  tableRef: HTMLElement,
  week: Week,
  time: ClassTime
): CourseBlockPos {
  console.log(tableRef);
  const weekIndex = weeks.findIndex((w) => w.label === week.label);
  const timeIndex = classTimes.findIndex((t) => t.label === time.label);

  const blockWidth = tableRef.scrollWidth / (weeks.length + 1);
  const blockHeight = tableRef.scrollHeight / classTimes.length;

  const x = blockWidth * (weekIndex + 1);
  const y = blockHeight * timeIndex;

  return { blockWidth, blockHeight, x, y };
}

export function getCourseCombinedPositions(
  tableRef: HTMLElement,
  times: { week: Week; time: ClassTime }[]
): CourseBlockPos[] {
  let weekMap: { [key: string]: { week: Week; time: ClassTime }[] } = {};

  //   Turn the time period on weekly
  times.forEach((t) => (weekMap[t.week.label] = []));
  times.forEach((t) => weekMap[t.week.label].push(t));

  let result: CourseBlockPos[] = [];

  for (const [key, value] of Object.entries(weekMap)) {
    let weekTimes = value.map((v) =>
      getCoursePosition(tableRef, v.week, v.time)
    );

    const min = weekTimes.reduce((prev, current) =>
      prev && prev.y < current.y ? prev : current
    );
    const max = weekTimes.reduce((prev, current) =>
      prev && prev.y > current.y ? prev : current
    );

    let final = min;
    final.blockHeight = max.y - min.y + max.blockHeight;

    result.push(final);
  }

  return result;
}
