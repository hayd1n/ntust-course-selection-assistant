<script lang="ts">
  import type { CourseBlockPos } from "./courseblock";

  //   export let width = 0;
  //   export let height = 0;
  //   export let top = 0;
  //   export let left = 0;

  export let variant: "normal" | "highlight" = "normal";

  export let position: CourseBlockPos;

  export let name = "";
  export let teacher = "";
</script>

<div
  role="button"
  tabindex="0"
  style={`width: ${position.blockWidth}px; height: ${position.blockHeight}px; top: ${position.y}px; left: ${position.x}px;`}
  class="absolute p-1.5"
  on:mouseenter
  on:mouseleave
>
  <div
    class="w-full h-full text-primary-foreground flex flex-col justify-center items-center text-sm rounded-md cursor-pointer select-none transition-colors {variant ==
    'highlight'
      ? 'bg-gray-700 dark:bg-gray-300'
      : 'bg-primary'}"
  >
    <p>{name}</p>
    <p class="text-xs">{teacher}</p>
  </div>
</div>
