<script lang="ts">
  import { Search, Settings, Table2 } from "lucide-svelte";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import { page } from "$app/stores";
  import { Button } from "./ui/button";
  import { pageSearchSelectedCourseNo as selectedCourseNo } from "$lib/store";
</script>

<div
  class="w-16 h-full flex flex-col flex-nowrap items-center shrink-0 border-r p-2 gap-1 overflow-hidden select-none"
>
  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="ghost"
        size="icon"
        draggable={false}
        href="/tables"
        class={$page.url.pathname.startsWith("/tables")
          ? ""
          : "text-muted-foreground"}
      >
        <Table2 class="h-4" />
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">
      <p>Tables</p>
    </Tooltip.Content>
  </Tooltip.Root>

  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="ghost"
        size="icon"
        draggable={false}
        href={"/search" +
          ($selectedCourseNo ? `/view?no=${$selectedCourseNo}` : "")}
        class={$page.url.pathname.startsWith("/search")
          ? ""
          : "text-muted-foreground"}
      >
        <Search class="h-4" />
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">
      <p>Search</p>
    </Tooltip.Content>
  </Tooltip.Root>

  <div class="flex grow"></div>

  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="ghost"
        size="icon"
        draggable={false}
        href="/settings"
        class={$page.url.pathname.startsWith("/settings")
          ? ""
          : "text-muted-foreground"}
      >
        <Settings class="h-4" />
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content side="right">
      <p>Settings</p>
    </Tooltip.Content>
  </Tooltip.Root>
</div>
