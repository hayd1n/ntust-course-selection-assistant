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

  const dispatch = createEventDispatcher<{
    click: { event: MouseEvent };
    mouseenter: { event: MouseEvent };
    mouseleave: { event: MouseEvent };
    contextmenu: { event: MouseEvent };
  }>();

  function handleClick(e: MouseEvent) {
    dispatch("click", { event: e });
  }

  function handleMouseEnter(e: MouseEvent) {
    dispatch("mouseenter", { event: e });
  }

  function handleMouseLeave(e: MouseEvent) {
    dispatch("mouseleave", { event: e });
  }

  function handleContextMenu(e: MouseEvent) {
    dispatch("contextmenu", { event: e });
  }
</script>

<div
  class="absolute p-1 transition-transform transform-gpu {highlight
    ? 'scale-[1.05] active:scale-[1.025]'
    : ''}"
  style:top={`${top}px`}
  style:left={`${left}px`}
  style:width={`${width}px`}
  style:height={`${height}px`}
  style:will-change="top, left"
>
  <div
    class="w-full h-full"
    aria-hidden={false}
    on:click={handleClick}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:contextmenu={handleContextMenu}
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
          <p class="text-xs opacity-70">{teacherName}</p>
        </div>
      </div>
    </HoverCard.Trigger>
  </div>
</div>
