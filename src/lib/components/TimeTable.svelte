<script lang="ts">
  import { Plus } from "lucide-svelte";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { createEventDispatcher } from "svelte";
  import { Button } from "./ui/button";
  import { classTimes, weeks } from "$lib/course";

  export let titlebarStuck: boolean = false;

  const dispatch = createEventDispatcher();

  function handleAddCourseClick() {
    dispatch("addCourse");
  }
</script>

<div>
  <table class="table title" class:stuck={titlebarStuck}>
    <thead>
      <tr>
        <th class="p-0">
          <div class="flex flex-col justify-center items-center">
            <Tooltip.Root openDelay={0}>
              <Tooltip.Trigger asChild let:builder>
                <Button
                  builders={[builder]}
                  size="sm"
                  variant="ghost"
                  class="w-full"
                  on:click={handleAddCourseClick}
                >
                  <Plus />
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>Add course</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </div>
        </th>
        {#each weeks as week}
          <th>{week.text}</th>
        {/each}
      </tr>
    </thead>
  </table>

  <slot />

  <table class="table">
    <tbody>
      {#each classTimes as time}
        <tr>
          <td>
            <p>{time.label}</p>
            <p class="text-xs">{time.start}</p>
            <p class="text-xs">{time.end}</p>
          </td>
          {#each weeks as _}
            <td></td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style lang="postcss">
  .table {
    @apply w-full;
    @apply border-collapse;
    @apply table-fixed;
    @apply text-center;
  }

  .table.title {
    @apply sticky top-0;
    @apply transition-shadow duration-500;
  }

  .table.stuck {
    @apply shadow-md;
  }

  .table thead tr {
    @apply bg-background;
  }

  .table th,
  .table td {
    @apply;
    @apply p-2;
    @apply overflow-hidden;
  }

  .table th:first-child {
    @apply border-r p-1;
  }

  .table th:not(:first-child) {
    @apply border-l border-r;
  }

  .table td:first-child {
    @apply border-t border-b border-r;
  }

  .table td:not(:first-child) {
    @apply border;
  }
</style>
