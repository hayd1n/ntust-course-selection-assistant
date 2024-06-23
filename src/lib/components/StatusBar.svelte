<script lang="ts">
  import { page } from "$app/stores";
  import {
    currentCourse,
    pageSearchSelectedCourseNo,
    uiSidemenuWidth,
  } from "$lib/context";
</script>

<div
  class="w-full h-6 shrink-0 border-t overflow-x-hidden overflow-y-auto select-none"
>
  <div
    class="w-full h-full flex flex-row items-center px-2 gap-1 overflow-y-hidden"
  >
    <!-- <p class="text-xs">Status Bar</p> -->
    <p class="text-xs">{$page.url}</p>
    <p class="text-xs">{$uiSidemenuWidth}</p>
    <p class="text-xs">{$pageSearchSelectedCourseNo}</p>
    <p class="text-xs">{JSON.stringify($currentCourse)}</p>
  </div>
</div>
