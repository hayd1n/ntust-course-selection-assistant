<script lang="ts">
  import { page } from "$app/stores";
  import { openUrl } from "$lib/api";
  import { Button } from "$lib/components/ui/button";
  import type { CourseDetails } from "$lib/course";
  import * as TopBar from "$lib/components/topbar";
  import { invoke } from "@tauri-apps/api";
  import { CalendarPlus } from "lucide-svelte";
  import { pageSearchSelectedCourseNo } from "$lib/store";

  $: courseNo = $page.url.searchParams.get("no");

  let courseDetails: CourseDetails | undefined = undefined;
  $: {
    $pageSearchSelectedCourseNo = courseNo;

    invoke<CourseDetails>("query_course", {
      semester: "1131",
      language: "en",
      courseNo,
    })
      .then((details) => {
        courseDetails = details;
        console.log(details);
      })
      .catch(() => (courseDetails = undefined));
  }
</script>

<TopBar.Root>
  <TopBar.Header>
    <TopBar.Title>{courseNo} {courseDetails?.courseName}</TopBar.Title>
    <TopBar.Subtitle>{courseDetails?.courseTeacher}</TopBar.Subtitle>
  </TopBar.Header>
  <TopBar.Space />
  <div class="flex flex-row flex-nowrap">
    <Button variant="ghost" size="icon">
      <CalendarPlus class="w-4" />
    </Button>
  </div>
</TopBar.Root>
<div class="w-full h-full flex flex-col items-center overflow-auto p-2">
  <div
    class="w-full lg:w-11/12 xl:w-10/12 flex flex-col flex-nowrap p-6 lg:px-0 gap-3"
  >
    <div class="flex flex-col flex-nowrap border-b pb-4 gap-1">
      <div class="flex flex-row flex-nowrap items-center gap-1">
        <div>
          <h3 class="text-lg font-bold leading-none">
            {courseDetails?.courseName}
          </h3>
        </div>
        <div>
          <span class="bg-secondary text-sm px-2 py-1 rounded">{courseNo}</span>
        </div>
      </div>
      <div class="flex flex-row flex-nowrap items-center gap-2">
        {#if courseDetails?.courseTeacher}
          <div class="text-sm text-secondary-foreground pr-2 border-r">
            {courseDetails?.courseTeacher}
          </div>
        {/if}
        <div class="text-sm text-secondary-foreground pr-2 border-r">
          {courseDetails?.creditPoint} credits
        </div>
        <div class="text-sm text-secondary-foreground">
          {courseDetails?.requireOption}
        </div>
      </div>
    </div>
    <div class="flex flex-row flex-nowrap gap-4">
      <div class="flex flex-col flex-nowrap gap-3 w-9/12">
        {#if courseDetails?.courseObject}
          <div class="description-container">
            <h4 class="description-title">Course Objectives</h4>
            <p class="description-content">
              {courseDetails?.courseObject}
            </p>
          </div>
        {/if}
        {#if courseDetails?.courseContent}
          <div class="description-container">
            <h4 class="description-title">Outline of Lectures</h4>
            <p class="description-content">
              {courseDetails?.courseContent}
            </p>
          </div>
        {/if}
        {#if courseDetails?.instruction1 || courseDetails?.instruction2 || courseDetails?.instruction3 || courseDetails?.instruction4 || courseDetails?.instructionOther}
          <div class="description-container">
            <h4 class="description-title">Method of Instruction</h4>
            <ul class="description-ul">
              {#if courseDetails?.instruction1}
                <li>Lecture: {courseDetails?.instruction1}%</li>
              {/if}
              {#if courseDetails?.instruction2}
                <li>Group discussion: {courseDetails?.instruction2}%</li>
              {/if}
              {#if courseDetails?.instruction3}
                <li>Case study: {courseDetails?.instruction3}%</li>
              {/if}
              {#if courseDetails?.instruction4}
                <li>Practical exercises: {courseDetails?.instruction4}%</li>
              {/if}
              {#if courseDetails?.instructionOther}
                <li>Others: {courseDetails?.instructionOther}</li>
              {/if}
            </ul>
          </div>
        {/if}
        {#if courseDetails?.courseTextbook}
          <div class="description-container">
            <h4 class="description-title">Textbooks</h4>
            <p class="description-content">
              {courseDetails?.courseTextbook}
            </p>
          </div>
        {/if}
        {#if courseDetails?.courseRefbook}
          <div class="description-container">
            <h4 class="description-title">References</h4>
            <p class="description-content">
              {courseDetails?.courseRefbook}
            </p>
          </div>
        {/if}
        {#if courseDetails?.courseRemark}
          <div class="description-container">
            <h4 class="description-title">Notice</h4>
            <p class="description-content">
              {courseDetails?.courseRemark}
            </p>
          </div>
        {/if}
        {#if courseDetails?.courseGrading}
          <div class="description-container">
            <h4 class="description-title">Grading</h4>
            <p class="description-content">
              {courseDetails?.courseGrading}
            </p>
          </div>
        {/if}
        {#if courseDetails?.courseNote}
          <div class="description-container">
            <h4 class="description-title">Notes</h4>
            <p class="description-content">
              {courseDetails?.courseNote}
            </p>
          </div>
        {/if}
        {#if courseDetails?.courseUrl}
          <div class="description-container">
            <h4 class="description-title">Websites</h4>
            <p class="description-content">
              <!-- svelte-ignore a11y-missing-attribute -->
              <a
                class="link"
                draggable={false}
                aria-hidden={false}
                on:click={() => openUrl(courseDetails?.courseUrl ?? "")}
                >{courseDetails?.courseUrl}</a
              >
            </p>
          </div>
        {/if}
        <!-- <pre>{JSON.stringify(courseDetails, null, 2)}</pre> -->
      </div>
      <div class="flex flex-col flex-nowrap w-3/12">
        <div class="description-container">
          <h4 class="description-title">Information</h4>
          <div class="information-list">
            <div class="information-container">
              <div class="information-title">Semester</div>
              <div>{courseDetails?.semester}</div>
            </div>
            <div class="information-container">
              <div class="information-title">Number</div>
              <div>{courseDetails?.courseNo}</div>
            </div>
            <div class="information-container">
              <div class="information-title">Name</div>
              <div>{courseDetails?.courseName}</div>
            </div>
            {#if courseDetails?.courseTeacher}
              <div class="information-container">
                <div class="information-title">Teacher</div>
                <div>{courseDetails?.courseTeacher}</div>
              </div>
            {/if}
            <div class="information-container">
              <div class="information-title">Credit Points</div>
              <div>{courseDetails?.creditPoint}</div>
            </div>
            <div class="information-container">
              <div class="information-title">Course Times</div>
              <div>{courseDetails?.courseTimes} hours</div>
            </div>
            <div class="information-container">
              <div class="information-title">Practical Times</div>
              <div>{courseDetails?.practicalTimes} hours</div>
            </div>
            <div class="information-container">
              <div class="information-title">Require</div>
              <div>{courseDetails?.requireOption}</div>
            </div>
            <div class="information-container">
              <div class="information-title">Year</div>
              <div>{courseDetails?.allYear}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .description-container {
    @apply flex flex-col flex-nowrap gap-1;
  }

  .description-title {
    @apply text-base font-bold leading-none select-none cursor-default;
  }

  .description-content {
    @apply text-sm whitespace-pre-wrap;
  }

  .description-ul {
    @apply text-sm;
    list-style-type: disc;
    list-style-position: inside;
  }

  .information-list {
    @apply flex flex-col flex-nowrap text-sm gap-0.5;
  }

  .information-container {
    @apply flex flex-row flex-nowrap gap-1;
  }

  .information-title {
    @apply font-bold select-none cursor-default;
  }
</style>
