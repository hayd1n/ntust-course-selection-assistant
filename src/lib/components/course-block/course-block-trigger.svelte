<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card/";
  import { CalendarDays } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  export let courseNo: string;
  export let courseName: string;
  export let teacherName: string;

  export let top: number = 0;
  export let left: number = 0;
  export let width: number = 0;
  export let height: number = 0;

  export let highlight: boolean = false;

  const dispatch = createEventDispatcher<{ mouseenter: {}; mouseleave: {} }>();

  function handleMouseEnter() {
    dispatch("mouseenter", {});
  }

  function handleMouseLeave() {
    dispatch("mouseleave", {});
  }
</script>

<div
  class="absolute transition-[padding] {highlight ? 'p-0.5' : 'p-1'}"
  style:top={`${top}px`}
  style:left={`${left}px`}
  style:width={`${width}px`}
  style:height={`${height}px`}
  style:will-change="top, left"
>
  <div
    class="w-full h-full"
    aria-hidden={false}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
  >
    <HoverCard.Trigger
      class="w-full h-full flex items-center font-medium transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 rounded-md p-3 text-xs justify-start shirnk-0 select-none overflow-hidden
      {highlight ? 'bg-primary/90 shadow-xl z-20' : ''}"
      draggable={false}
    >
      <div class="w-full">
        <div class="space-y-1">
          <!-- <h4 class="text-xs font-semibold">{courseNo}</h4> -->
          <h4 class="text-xs font-semibold">{courseName}</h4>
          <p class="text-xs">{teacherName}</p>
        </div>
      </div>
    </HoverCard.Trigger>
  </div>
</div>
