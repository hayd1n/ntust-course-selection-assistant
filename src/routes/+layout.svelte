<script lang="ts">
  import Sidemenu from "$lib/Sidemenu.svelte";
  import { ModeWatcher } from "mode-watcher";
  import "../app.pcss";
</script>

<div class="w-screen h-screen">
  <div class="h-full flex flex-row flex-nowrap">
    <div>
      <Sidemenu />
    </div>
    <div class="grow min-h-full overflow-x-hidden overflow-y-auto">
      <slot></slot>
    </div>
  </div>
</div>

<ModeWatcher />

<style></style>
