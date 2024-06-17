<svelte:options accessors />

<script lang="ts">
  import SidemenuHandle from "./sidemenu-handle.svelte";
  import { writable } from "svelte/store";
  import { createEventDispatcher, getContext, setContext } from "svelte";
  import { contextKey, type Context, type ResizingEvent } from ".";

  export let node: HTMLElement | undefined = undefined;

  export let width = 192;
  export let minWidth = -1;
  export let maxWidth = -1;

  setContext<Context>(contextKey, {
    width: writable<number>(width),
    minWidth: writable<number>(minWidth),
    maxWidth: writable<number>(maxWidth),
  });

  const context = getContext<Context>(contextKey);
  const contextWidth = context.width;
  const contextMinWidth = context.minWidth;
  const contextMaxWidth = context.maxWidth;

  $: {
    contextMinWidth.set(minWidth);
    contextMaxWidth.set(maxWidth);
  }

  $: {
    let newWidth = $contextWidth;

    if ($contextMaxWidth >= 0) newWidth = Math.min(newWidth, $contextMaxWidth);
    if ($contextMinWidth >= 0) newWidth = Math.max(newWidth, $contextMinWidth);

    $contextWidth = newWidth;
    width = $contextWidth;
  }

  const dispatch = createEventDispatcher<{
    resizing: ResizingEvent;
  }>();

  function handleResizing(e: CustomEvent<ResizingEvent>) {
    dispatch("resizing", e.detail);
  }
</script>

<div
  class="h-full flex flex-row flex-nowrap shrink-0 relative overflow-x-hidden overflow-y-auto"
  style:width={`${width}px`}
  bind:this={node}
  {...$$restProps}
>
  <div class="w-full h-full flex flex-col flex-nowrap gap-2">
    <slot />
  </div>
  <SidemenuHandle on:resizing={handleResizing} />
</div>
