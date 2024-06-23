<script lang="ts">
  import * as Sidemenu from "$lib/components/sidemenu";
  import { setStateSidemenuWidth } from "$lib/storage";
  import { uiSidemenuWidth } from "$lib/context";

  let windowWidth = 0;
  let sidemenuRef: HTMLElement | undefined = undefined;

  // caculate the sidemenu max width
  // set -1 to disable max width since the window width is not set
  $: sidemenuMaxWidth =
    windowWidth !== 0
      ? windowWidth / 2 - (sidemenuRef?.getBoundingClientRect().left ?? 0)
      : -1;

  async function handleSidemenuResizing(
    e: CustomEvent<Sidemenu.ResizingEvent>
  ) {
    await setStateSidemenuWidth(e.detail.newWidth);
  }
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="w-full h-full flex flex-row">
  <Sidemenu.Root
    bind:node={sidemenuRef}
    bind:width={$uiSidemenuWidth}
    minWidth={192}
    maxWidth={sidemenuMaxWidth}
    on:resizing={handleSidemenuResizing}
  >
    <slot name="sidemenu" />
  </Sidemenu.Root>
  <div class="w-full min-h-full flex flex-col grow overflow-hidden">
    <slot />
  </div>
</div>
