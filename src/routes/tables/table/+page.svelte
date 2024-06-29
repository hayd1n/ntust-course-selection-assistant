<script lang="ts">
  import * as Timetable from "$lib/components/timetable";
  import * as CourseBlock from "$lib/components/course-block";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import * as Dialog from "$lib/components/ui/dialog";
  import {
    ClassTimes,
    Weeks,
    parseWeekRanges,
    type CourseInfo,
    type WeekRange,
  } from "$lib/course";
  import { onMount } from "svelte";
  import {
    addCourseToTable,
    deleteTableCourse,
    getTableCourses,
  } from "$lib/tables";
  import { page } from "$app/stores";
  import { getStoreAllTables, getStoreTable } from "$lib/storage";
  import { goto } from "$app/navigation";
  import { showMenu } from "tauri-plugin-context-menu";
  import { toast } from "svelte-sonner";
  import { gotoCourse } from "$lib/navigate";
  import LoadingBar from "$lib/components/LoadingBar.svelte";
  import TableSelector from "$lib/components/TableSelector.svelte";
  import { Button } from "$lib/components/ui/button";

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

  let selectdCourses: string[] = [];

  let courseCopyMode: "copy" | "move" | null;
  let courseCopyMoveDialogOpen = false;
  let courseCopySelectedTable: string | null = null;

  let courseDeleteDialogOpen = false;

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
    course: CourseInfo;
    positions: {
      top: number;
      left: number;
      width: number;
      height: number;
      hoverOpen: boolean;
    }[];
    highlight: boolean;
  }[] = [];

  function calculateCoursePositions() {
    coursePositions = courses.map((course) => {
      return {
        course,
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
              hoverOpen: false,
            };

          return {
            top: startCellRef.offsetTop,
            left: startCellRef.offsetLeft,
            width: startCellRef.offsetWidth,
            height:
              endCellRef.offsetTop -
              startCellRef.offsetTop +
              endCellRef.offsetHeight,
            hoverOpen: false,
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

  function closeAllCoursesBlockHoverCard() {
    coursePositions.forEach((c) =>
      c.positions.forEach((p) => (p.hoverOpen = false))
    );
    coursePositions = coursePositions;
  }

  function handleCourseViewClick(course: CourseInfo) {
    gotoCourse(course);
  }

  function handleCourseCopyMoveClick(
    course: CourseInfo,
    mode: "copy" | "move"
  ) {
    closeAllCoursesBlockHoverCard();

    selectdCourses = [course.courseNo];

    courseCopyMode = mode;

    courseCopyMoveDialogOpen = true;
  }

  function handleCourseDeleteClick(course: CourseInfo) {
    closeAllCoursesBlockHoverCard();

    selectdCourses = [course.courseNo];

    courseDeleteDialogOpen = true;
  }

  async function handleCourseCopyMoveSubmit() {
    if (!tableName || !courseCopySelectedTable) return;

    const promises = selectdCourses.map((courseNo) => {
      // find course info for copy
      const course = courses.find((info) => info.courseNo === courseNo);
      if (!course) return;

      return addCourseToTable(courseCopySelectedTable!, course);
    });

    // wait for all courses to be added
    await Promise.all(promises);

    if (courseCopyMode === "move") {
      // delete all selected courses
      const promises = selectdCourses.map((c) =>
        deleteTableCourse(tableName, c)
      );

      // wait for all courses to be deleted
      await Promise.all(promises);
    }

    // refresh courses
    await getCourses();

    courseCopyMoveDialogOpen = false;

    toast.success(
      courseCopyMode === "copy"
        ? "Course Copy Successful"
        : "Course Move Successful",
      {
        description:
          courseCopyMode === "copy"
            ? `Successful copy ${selectdCourses.length} course to ${courseCopySelectedTable}`
            : `Successful move ${selectdCourses.length} course to ${courseCopySelectedTable}`,
      }
    );

    selectdCourses = [];
    courseCopySelectedTable = null;
  }

  async function handleCourseDeleteSubmit() {
    if (!tableName) return;

    // delete all selected courses
    const promises = selectdCourses.map((c) => deleteTableCourse(tableName, c));

    // wait for all courses to be deleted
    await Promise.all(promises);

    // refresh courses
    await getCourses();

    courseDeleteDialogOpen = false;

    toast.success("Course deleted successfully", {
      description: `Successfully delete ${selectdCourses.length} course`,
    });

    selectdCourses = [];
  }

  async function handleCourseBlockContextMenu(
    e: CustomEvent<{
      event: MouseEvent;
    }>,
    course: CourseInfo
  ) {
    e.detail.event.preventDefault();

    closeAllCoursesBlockHoverCard();

    await showMenu({
      items: [
        {
          label: "View",
          event: (e) => handleCourseViewClick(e?.payload.course),
          payload: { course },
          shortcut: "cmd+o",
        },
        { is_separator: true },
        {
          label: "Copy to",
          event: (e) => handleCourseCopyMoveClick(e?.payload.course, "copy"),
          payload: { course },
          shortcut: "cmd+shift+c",
        },
        {
          label: "Move to",
          event: (e) => handleCourseCopyMoveClick(e?.payload.course, "move"),
          payload: { course },
          shortcut: "cmd+shift+v",
        },
        { is_separator: true },
        {
          label: "Delete",
          event: (e) => handleCourseDeleteClick(e?.payload.course),
          payload: { course },
          shortcut: "delete",
        },
      ],
    });
  }

  onMount(async () => {
    await getCourses();
    calculateCoursePositions();
  });
</script>

<div class="h-full min-h-full overflow-y-auto">
  <div
    class="relative min-h-full"
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

    {#each coursePositions as block}
      {#each block.positions as position}
        <CourseBlock.Root bind:open={position.hoverOpen}>
          <CourseBlock.Trigger
            courseNo={block.course.courseNo}
            courseName={block.course.courseName}
            teacherName={block.course.courseTeacher}
            top={position.top}
            left={position.left}
            width={position.width}
            height={position.height}
            highlight={block.highlight}
            on:mouseenter={() => (block.highlight = true)}
            on:mouseleave={() => (block.highlight = false)}
            on:click={() => handleCourseViewClick(block.course)}
            on:contextmenu={(e) =>
              handleCourseBlockContextMenu(e, block.course)}
          />
          <!-- <CourseBlock.Content /> -->
        </CourseBlock.Root>
      {/each}
    {/each}
  </div>
</div>

<!-- Copy/Move Course to Tabel Dialog -->
<Dialog.Root bind:open={courseCopyMoveDialogOpen}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title
        >{courseCopyMode === "copy" ? "Copy" : "Move"} to table</Dialog.Title
      >
      <Dialog.Description>
        Please select the table you would like to {courseCopyMode} to
      </Dialog.Description>
    </Dialog.Header>
    {#await getStoreAllTables()}
      <LoadingBar />
    {:then tables}
      {#if tables}
        <TableSelector
          tables={tables.map((t) => t.name).filter((t) => t !== tableName)}
          bind:selected={courseCopySelectedTable}
        />
      {:else}
        <p>No table found.</p>
      {/if}
    {/await}
    <Dialog.Footer>
      <Button
        type="submit"
        disabled={courseCopySelectedTable === null}
        on:click={handleCourseCopyMoveSubmit}
        >{courseCopyMode === "copy" ? "Copy" : "Move"}</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Delete Course Confirm Dialog -->
<AlertDialog.Root bind:open={courseDeleteDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure you want to delete it?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will delete the course from your
        table.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={handleCourseDeleteSubmit}
        >Delete</AlertDialog.Action
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
