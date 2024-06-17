<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card/";
  import { CalendarDays } from "lucide-svelte";

  export let courseNo: string;
  export let courseName: string;
  export let teacherName: string;
  export let courseNode: string | undefined = undefined;

  export let activated: boolean = false;
</script>

<HoverCard.Trigger
  class="inline-flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-md p-3 text-xs justify-start shirnk-0 select-none 
  {activated
    ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90'
    : 'hover:bg-accent hover:text-accent-foreground'}"
  draggable={false}
  {...$$restProps}
>
  <div class="w-full">
    <div class="space-y-1">
      <h4 class="text-sm font-semibold">{courseNo}</h4>
      <h4 class="text-sm font-semibold">{courseName}</h4>
      <p class="text-sm">{teacherName}</p>
      {#if courseNode}
        <div class="flex items-center pt-2">
          <CalendarDays class="mr-2 h-4 w-4 opacity-70 shrink-0" />
          <span class="text-xs text-muted-foreground truncate"
            >{courseNode}</span
          >
        </div>
      {/if}
    </div>
  </div>
</HoverCard.Trigger>
