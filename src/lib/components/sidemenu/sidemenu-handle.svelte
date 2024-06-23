<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte";
  import { contextKey, type Context, type ResizingEvent } from ".";

  let resizing = false;

  let startX = 0;
  let startWidth = 0;

  const context = getContext<Context>(contextKey);

  const contextWidth = context.width;
  const contextMinWidth = context.minWidth;
  const contextMaxWidth = context.maxWidth;

  const dispatch = createEventDispatcher<{
    resizing: ResizingEvent;
  }>();

  function handleMouseDown(e: MouseEvent) {
    if (e.button !== 0) return;

    resizing = true;
    startX = e.screenX;
    startWidth = $contextWidth;
  }

  function handleMouseUp(e: MouseEvent) {
    if (!resizing || e.button !== 0) return;

    resizing = false;
  }

  function handleMouseMove(e: MouseEvent) {
    if (!resizing || e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    const offsetX = e.screenX - startX;
    let newWidth = startWidth + offsetX;
    if ($contextMinWidth >= 0) newWidth = Math.max(newWidth, $contextMinWidth);
    if ($contextMaxWidth >= 0) newWidth = Math.min(newWidth, $contextMaxWidth);
    $contextWidth = newWidth;

    dispatch("resizing", { newWidth });
  }
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

<div
  class="handle"
  class:resizing
  aria-hidden={true}
  on:mousedown={handleMouseDown}
/>

<style lang="postcss">
  .handle {
    @apply h-full border-r shrink-0 transition-colors absolute top-0 right-0;
    @apply cursor-col-resize select-none;
    @apply hover:border-primary/30;
  }

  .handle.resizing {
    @apply border-primary/40;
  }

  :global(*:has(.handle.resizing)) {
    @apply !cursor-col-resize !select-none;
  }
</style>
