<script lang="ts">
  import * as TopBar from "$lib/components/topbar";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { page } from "$app/stores";
  import { openUrl } from "$lib/api";
  import { Button } from "$lib/components/ui/button";
  import type { CourseDetails } from "$lib/course";
  import { invoke } from "@tauri-apps/api";
  import { CalendarPlus } from "lucide-svelte";
  import { getStoreAllTables } from "$lib/storage";
  import { currentCourse } from "$lib/context";
  import { addCourseToTable } from "$lib/tables";
  import { toast } from "svelte-sonner";
  import LoadingBar from "$lib/components/LoadingBar.svelte";
  import TableSelector from "$lib/components/TableSelector.svelte";

  $: courseNo = $page.url.searchParams.get("no");

  let courseDetails: CourseDetails | undefined = undefined;
  $: {
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

  let addToTableDialogOpen = false;

  let selectedTable: string | null = null;

  async function handleAddCourseToTable() {
    if (!$currentCourse || !selectedTable) return;
    await addCourseToTable(selectedTable, $currentCourse);
    addToTableDialogOpen = false;

    toast.success("Add to table successful", {
      description: `Add ${courseNo} to ${selectedTable} successful`,
    });
  }
</script>

<TopBar.Root>
  <TopBar.Header>
    <TopBar.Title>{courseNo} {courseDetails?.courseName}</TopBar.Title>
    <TopBar.Subtitle>{courseDetails?.courseTeacher}</TopBar.Subtitle>
  </TopBar.Header>
  <TopBar.Space />
  <div class="flex flex-row flex-nowrap">
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <Button
          builders={[builder]}
          variant="ghost"
          size="icon"
          on:click={() => (addToTableDialogOpen = true)}
        >
          <CalendarPlus class="w-4" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom">
        <p>Add to table</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </div>
</TopBar.Root>

<div class="w-full h-full flex flex-col items-center overflow-auto p-2">
  <div
    class="w-full lg:w-11/12 xl:w-10/12 flex flex-col flex-nowrap p-6 lg:px-0 gap-3"
  >
    <div class="flex flex-col flex-nowrap border-b pb-4 gap-1 select-none">
      <div class="flex flex-row flex-nowrap items-center gap-1">
        <div>
          <h3 class="text-lg font-bold leading-none">
            {courseDetails?.courseName}
          </h3>
        </div>
        <div>
          <span
            class="bg-secondary text-sm px-2 py-1 rounded select-text cursor-text"
            >{courseNo}</span
          >
        </div>
      </div>
      <div class="flex flex-row flex-nowrap items-center gap-2">
        {#if courseDetails?.courseTeacher}
          <div
            class="text-sm text-secondary-foreground
            [&:not(:last-child)]:pr-2 [&:not(:last-child)]:border-r"
          >
            {courseDetails?.courseTeacher}
          </div>
        {/if}
        <div
          class="text-sm text-secondary-foreground
          [&:not(:last-child)]:pr-2 [&:not(:last-child)]:border-r"
        >
          {courseDetails?.creditPoint} credits
        </div>
        <div
          class="text-sm text-secondary-foreground
          [&:not(:last-child)]:pr-2 [&:not(:last-child)]:border-r"
        >
          {courseDetails?.requireOption}
        </div>
        <div
          class="text-sm text-secondary-foreground
          [&:not(:last-child)]:pr-2 [&:not(:last-child)]:border-r"
        >
          {courseDetails?.allYear}
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
              <div class="information-content">{courseDetails?.semester}</div>
            </div>
            <div class="information-container">
              <div class="information-title">Number</div>
              <div class="information-content">{courseDetails?.courseNo}</div>
            </div>
            <div class="information-container">
              <div class="information-title">Name</div>
              <div class="information-content">{courseDetails?.courseName}</div>
            </div>
            {#if courseDetails?.courseTeacher}
              <div class="information-container">
                <div class="information-title">Teacher</div>
                <div class="information-content">
                  {courseDetails?.courseTeacher}
                </div>
              </div>
            {/if}
            <div class="information-container">
              <div class="information-title">Credit Points</div>
              <div class="information-content">
                {courseDetails?.creditPoint}
              </div>
            </div>
            <div class="information-container">
              <div class="information-title">Course Times</div>
              <div class="information-content">
                {courseDetails?.courseTimes} hours
              </div>
            </div>
            <div class="information-container">
              <div class="information-title">Practical Times</div>
              <div class="information-content">
                {courseDetails?.practicalTimes} hours
              </div>
            </div>
            <div class="information-container">
              <div class="information-title">Require</div>
              <div class="information-content">
                {courseDetails?.requireOption}
              </div>
            </div>
            <div class="information-container">
              <div class="information-title">Year</div>
              <div class="information-content">{courseDetails?.allYear}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Add Course to Tabel Dialog -->
<Dialog.Root bind:open={addToTableDialogOpen}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Add {courseNo} to table</Dialog.Title>
      <Dialog.Description>
        Please select the table you would like to add
      </Dialog.Description>
    </Dialog.Header>
    {#await getStoreAllTables()}
      <LoadingBar />
    {:then tables}
      {#if tables}
        <TableSelector
          tables={tables.map((t) => t.name)}
          bind:selected={selectedTable}
        />
      {:else}
        <p>No table found.</p>
      {/if}
    {/await}
    <Dialog.Footer>
      <Button
        type="submit"
        disabled={selectedTable === ""}
        on:click={handleAddCourseToTable}>Add</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<style lang="postcss">
  .description-container {
    @apply flex flex-col flex-nowrap gap-1;
  }

  .description-title {
    @apply text-base font-bold leading-none select-none;
  }

  .description-content {
    @apply text-sm whitespace-pre-wrap select-text;
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
    @apply font-bold select-none;
  }

  .information-content {
    @apply select-text;
  }
</style>
