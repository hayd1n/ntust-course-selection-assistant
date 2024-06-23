<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  import "../app.pcss";
  import ActivityBar from "$lib/components/ActivityBar.svelte";
  import StatusBar from "$lib/components/StatusBar.svelte";
  import { onMount } from "svelte";
  import { getStateSidemenuWidth } from "$lib/storage";
  import { uiSidemenuWidth } from "$lib/context";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { Toaster } from "$lib/components/ui/sonner";

  onMount(async () => {
    const storeUiSidemenuWidth = await getStateSidemenuWidth();
    if (storeUiSidemenuWidth !== null) $uiSidemenuWidth = storeUiSidemenuWidth;

    // navigate to tables page when startup
    if ($page.url.pathname === "/") goto("/tables");
  });
</script>

<div class="w-screen h-screen flex flex-col border-t">
  <div class="flex flex-row flex-nowrap grow shrink overflow-hidden">
    <ActivityBar />
    <div class="flex grow shrink h-full overflow-x-hidden overflow-y-auto">
      <slot />
    </div>
  </div>
  <StatusBar />
</div>

<Toaster />

<ModeWatcher />

<style></style>
