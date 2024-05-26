<script lang="ts">
  import { getClient, Client } from "@tauri-apps/api/http";
  import TimeTable from "$lib/TimeTable.svelte";
  import * as Command from "$lib/components/ui/command";
  import { onMount } from "svelte";
  import {
    classTimes,
    parseTimeString,
    weeks,
    type ClassTime,
    type Course,
    type Week,
  } from "$lib/course";
  import { SearchLang, searchCourse } from "$lib/api";
  import { getCourseCombinedPositions } from "$lib/timetable";
  import type { CourseBlockPos } from "$lib/courseblock";
  import { Plus } from "lucide-svelte";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import CourseBlock from "$lib/CourseBlock.svelte";
  import { Button } from "$lib/components/ui/button";

  let searchDialogOpen = false;
  let searchText = "";
  let lastSearchText = searchText;
  let searching = false;

  let searchCourses: Course[] = [];
  let searchCoursesCache: Course[] = [];

  let tableRef: HTMLElement | null = null;

  let scrollY = 0;
  $: titlebarStuck = scrollY > 0;

  let httpClient: Client | null = null;

  let selectedCourses: Course[] = [];
  let selectedCoursesBlock: { course: Course; pos: CourseBlockPos }[][] = [];
  $: selectedCoursesBlock = tableRef
    ? selectedCourses
        .map((c) => {
          let parsedTimes = parseTimeString(c.Node);

          if (!parsedTimes.some((t) => t === null)) {
            let filertedTimes: {
              week: Week;
              time: ClassTime;
            }[] = parsedTimes.filter(
              (t): t is { week: Week; time: ClassTime } => t !== null
            );

            return getCourseCombinedPositions(tableRef!, filertedTimes).map(
              (p) => {
                return {
                  course: c,
                  pos: p,
                };
              }
            );
          }

          return null;
        })
        .filter(
          (c): c is { course: Course; pos: CourseBlockPos }[] => c !== null
        )
    : [];
  let highlightCourses: Course[] = [];

  onMount(() => {
    getClient().then((c) => (httpClient = c));

    const searchInterval = setInterval(handleIntervalSearchCourse, 500);

    return () => {
      httpClient && httpClient.drop();

      clearInterval(searchInterval);
    };
  });

  async function handleIntervalSearchCourse() {
    if (httpClient === null) return;

    const currentSearchText = searchText;
    if (lastSearchText === currentSearchText || searching) return;

    const english = /^[A-Za-z0-9]*$/;
    if (english.test(currentSearchText) && currentSearchText.length <= 2) {
      lastSearchText = currentSearchText;
      return;
    }

    searching = true;
    searchCourses = await searchCourse(
      httpClient,
      currentSearchText,
      SearchLang.zh
    );
    searchCoursesCache = searchCourses;
    searching = false;

    lastSearchText = currentSearchText;
  }

  function handleSelectCourse(course: Course) {
    selectedCourses = [...selectedCourses, course];
    searchDialogOpen = false;
  }
</script>

<div
  class="content-container"
  on:scroll={(e) => (scrollY = e.currentTarget.scrollTop)}
>
  <div>
    <table class="table title" class:stuck={titlebarStuck}>
      <thead>
        <tr>
          <th class="p-0">
            <div class="flex flex-col justify-center items-center">
              <Tooltip.Root openDelay={0}>
                <Tooltip.Trigger asChild let:builder>
                  <Button
                    builders={[builder]}
                    size="sm"
                    variant="ghost"
                    class="w-full"
                    on:click={() => (searchDialogOpen = true)}
                  >
                    <Plus />
                  </Button>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <p>Add course</p>
                </Tooltip.Content>
              </Tooltip.Root>
            </div>
          </th>
          {#each weeks as week}
            <th>{week.text}</th>
          {/each}
        </tr>
      </thead>
    </table>

    <div class="relative">
      {#each selectedCoursesBlock as blocks}
        {#each blocks as block}
          <CourseBlock
            variant={highlightCourses.indexOf(block.course) !== -1
              ? "highlight"
              : "normal"}
            bind:position={block.pos}
            bind:name={block.course.CourseName}
            bind:teacher={block.course.CourseTeacher}
            on:mouseenter={() =>
              (highlightCourses = [...highlightCourses, block.course])}
            on:mouseleave={() =>
              (highlightCourses = highlightCourses.filter(
                (c) => c !== block.course
              ))}
          />
        {/each}
      {/each}
    </div>

    <table class="table" bind:this={tableRef}>
      <tbody>
        {#each classTimes as time}
          <tr>
            <td>
              <p>{time.label}</p>
              <p class="text-xs">{time.start}</p>
              <p class="text-xs">{time.end}</p>
            </td>
            {#each weeks as _}
              <td></td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<Command.Dialog bind:open={searchDialogOpen}>
  <Command.Input
    placeholder="Type a course number or search..."
    bind:value={searchText}
  />
  <Command.List>
    {#if searching}
      <div class="w-full">
        <div class="h-1 w-full bg-secondary overflow-hidden">
          <div class="progress w-full h-full bg-primary left-right"></div>
        </div>
      </div>
      {#if searchCoursesCache.length === 0}
        <Command.Empty>Searching courses…</Command.Empty>
      {:else}
        {#each searchCoursesCache as course}
          <Command.Item onSelect={() => handleSelectCourse(course)}>
            {course.CourseNo}
            {course.CourseName}
            {course.CourseTeacher}
          </Command.Item>
        {/each}
      {/if}
    {:else if searchCourses !== null && searchCourses.length > 0}
      {#each searchCourses as course}
        <Command.Item onSelect={() => handleSelectCourse(course)}>
          {course.CourseNo}
          {course.CourseName}
          {course.CourseTeacher}
        </Command.Item>
      {/each}
    {:else}
      <Command.Empty>No result found</Command.Empty>
    {/if}
  </Command.List>
</Command.Dialog>

<style lang="postcss">
  .content-container {
    @apply w-full h-full overflow-y-auto;
  }

  .table {
    @apply w-full;
    @apply border-collapse;
    @apply table-fixed;
    @apply text-center;
  }

  .table.title {
    @apply sticky top-0 z-10;
    @apply transition-shadow duration-500;
  }

  .table.stuck {
    @apply shadow-md;
  }

  .table thead tr {
    @apply bg-background;
  }

  .table th,
  .table td {
    @apply border-secondary;
    @apply p-2;
    @apply overflow-hidden;
  }

  .table th:first-child {
    @apply border-r p-1;
  }

  .table th:not(:first-child) {
    @apply border-l border-r;
  }

  .table td:first-child {
    @apply border-t border-b border-r;
  }

  .table td:not(:first-child) {
    @apply border;
  }

  .progress {
    animation: progress 1s infinite linear;
  }

  .left-right {
    transform-origin: 0% 50%;
  }

  @keyframes progress {
    0% {
      transform: translateX(0) scaleX(0);
    }
    40% {
      transform: translateX(0) scaleX(0.4);
    }
    100% {
      transform: translateX(100%) scaleX(0.5);
    }
  }
</style>
