<script lang="ts">
  import * as Timetable from "$lib/components/timetable";
  import * as CourseBlock from "$lib/components/course-block";
  import {
    ClassTimes,
    Weeks,
    parseWeekRanges,
    type CourseInfo,
    type WeekRange,
  } from "$lib/course";
  import { onMount } from "svelte";
  import { getTableCourses } from "$lib/tables";
  import { page } from "$app/stores";
  import { getStoreAllTables, getStoreTable } from "$lib/storage";
  import { goto } from "$app/navigation";

  $: tableName = $page.url.searchParams.get("name");
  $: {
    // navigate to empty page if table name is not exists
    if (!tableName) goto("/tables");
    else
      getStoreTable(tableName).then((table) => {
        if (!table) goto("/tables");
      });
  }

  let tableViewWidth = 0;
  let tableViewHeight = 0;

  let classCellRefs: (HTMLTableCellElement | undefined)[][] = Weeks.map((_) => {
    return ClassTimes.map((_) => {
      return undefined;
    });
  });

  interface Course extends CourseInfo {
    weekRange: WeekRange[];
  }

  let courses: Course[] = [];
  $: {
    getCourses();
    [tableName];
  }

  async function getCourses() {
    if (!tableName) return;

    const all = await getTableCourses(tableName);
    courses = all.map((course) => {
      return {
        ...course,
        weekRange: course.node ? parseWeekRanges(course.node) : [],
      };
    });
  }

  let coursePositions: {
    courseNo: string;
    courseName: string;
    teacherName: string;
    positions: {
      top: number;
      left: number;
      width: number;
      height: number;
    }[];
    highlight: boolean;
  }[] = [];

  function calculateCoursePositions() {
    coursePositions = courses.map((course) => {
      return {
        courseNo: course.courseNo,
        courseName: course.courseName,
        teacherName: course.courseTeacher,
        positions: course.weekRange.map((weekRange) => {
          const startCellRef =
            classCellRefs[weekRange.weekIndex][weekRange.startIndex];
          const endCellRef =
            classCellRefs[weekRange.weekIndex][weekRange.endIndex];

          if (!startCellRef || !endCellRef)
            return {
              top: 0,
              left: 0,
              width: 0,
              height: 0,
            };

          return {
            top: startCellRef.offsetTop,
            left: startCellRef.offsetLeft,
            width: startCellRef.offsetWidth,
            height:
              endCellRef.offsetTop -
              startCellRef.offsetTop +
              endCellRef.offsetHeight,
          };
        }),
        highlight: false,
      };
    });
  }

  $: {
    calculateCoursePositions();
    [tableViewWidth, tableViewHeight, courses];
  }

  onMount(async () => {
    await getCourses();
    calculateCoursePositions();
  });
</script>

<div class="h-full overflow-y-auto">
  <div
    class="relative"
    bind:offsetWidth={tableViewWidth}
    bind:offsetHeight={tableViewHeight}
  >
    <!-- <div class="w-full fixed z-30">
        <LoadingBar />
      </div> -->

    <Timetable.Root>
      <Timetable.Header>
        <Timetable.Row>
          <Timetable.Head></Timetable.Head>
          {#each Weeks as week}
            <Timetable.Head>{week.text}</Timetable.Head>
          {/each}
        </Timetable.Row>
      </Timetable.Header>
      <Timetable.Body>
        {#each ClassTimes as time, i}
          <Timetable.Row>
            <Timetable.Cell>
              <p class="text-xs">{time.label}</p>
              <p class="text-xs">{time.start}</p>
              <p class="text-xs">{time.end}</p>
            </Timetable.Cell>
            {#each Weeks as _, j}
              <Timetable.Cell bind:node={classCellRefs[j][i]}></Timetable.Cell>
            {/each}
          </Timetable.Row>
        {/each}
      </Timetable.Body>
    </Timetable.Root>

    {#each coursePositions as course}
      {#each course.positions as position}
        <CourseBlock.Root>
          <CourseBlock.Trigger
            courseNo={course.courseNo}
            courseName={course.courseName}
            teacherName={course.teacherName}
            top={position.top}
            left={position.left}
            width={position.width}
            height={position.height}
            highlight={course.highlight}
            on:mouseenter={() => (course.highlight = true)}
            on:mouseleave={() => (course.highlight = false)}
          />
          <CourseBlock.Content />
        </CourseBlock.Root>
      {/each}
    {/each}
  </div>
</div>
