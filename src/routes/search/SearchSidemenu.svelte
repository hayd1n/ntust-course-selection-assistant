<script lang="ts">
  import LoadingBar from "$lib/components/LoadingBar.svelte";
  import * as Sidemenu from "$lib/components/sidemenu";
  import * as CourseCard from "$lib/components/course-card";
  import { Input } from "$lib/components/ui/input";
  import { page } from "$app/stores";
  import { searchResult, searchText } from "$lib/store";
  import type { CourseInfo } from "$lib/course";
  import { onMount } from "svelte";
  import { listen, type UnlistenFn } from "@tauri-apps/api/event";
  import { invoke } from "@tauri-apps/api";

  let searching: boolean = false;
  let searchingText: string = $searchText;

  $: {
    if ($searchText.toLowerCase() !== searchingText.toLowerCase())
      searching = $searchText !== "";
  }

  interface SearchCallback {
    text: string;
    results: CourseInfo[];
  }

  onMount(() => {
    let unlisten: UnlistenFn | undefined = undefined;
    listen<SearchCallback>("search-update", (event) => {
      if ($searchText.toLowerCase() === event.payload.text)
        $searchResult = event.payload.results;
    }).then((fn) => (unlisten = fn));

    const searchInterval = setInterval(async function () {
      if (
        $searchText === "" ||
        $searchText.toLowerCase() === searchingText.toLowerCase()
      )
        return;

      searchingText = $searchText;
      searching = true;
      const requestSearchText = $searchText;
      console.log("start searching...", requestSearchText);
      await invoke("search_course", {
        semester: "1131",
        language: "en",
        text: $searchText.toLowerCase(),
      });
      // only when the search result is determined to
      // be the latest, the searching is set to false
      console.log("search complete", requestSearchText);
      if (requestSearchText.toLowerCase() === $searchText.toLowerCase())
        searching = false;
    }, 500);

    return function () {
      if (unlisten) unlisten();
      clearInterval(searchInterval);
    };
  });
</script>

<Sidemenu.Header>
  <Sidemenu.Title>Search</Sidemenu.Title>
  <Input
    type="search"
    placeholder="Search Course in NTUST"
    class="w-full h-8"
    bind:value={$searchText}
  />
  {#if searching}
    <LoadingBar variant="rounded" />
  {/if}
</Sidemenu.Header>
<Sidemenu.Content>
  <div class="w-full flex flex-col flex-nowrap gap-1">
    {#each $searchResult as course}
      <CourseCard.Root>
        <CourseCard.Trigger
          courseNo={course.courseNo}
          courseName={course.courseName}
          teacherName={course.courseTeacher}
          courseNode={course.node?.replaceAll(",", ", ")}
          href={`/search/view?no=${course.courseNo}`}
          activated={$page.url.pathname.startsWith(`/search/view`) &&
            $page.url.searchParams.get("no") === course.courseNo}
        />
      </CourseCard.Root>
    {/each}
  </div>
</Sidemenu.Content>
