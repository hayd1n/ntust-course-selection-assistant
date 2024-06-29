<script lang="ts">
  import * as Command from "$lib/components/ui/command";
  import * as Popover from "$lib/components/ui/popover";
  import { CaretSort, Check } from "svelte-radix";
  import { Button } from "./ui/button";
  import { tick } from "svelte";
  import { cn } from "$lib/utils";

  export let loading: boolean = false;
  export let tables: string[];
  export let selected: string | null = null;

  let selectorOpen = false;

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    selectorOpen = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<div class="grid relative">
  <Popover.Root bind:open={selectorOpen} let:ids>
    <Popover.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        variant="outline"
        role="combobox"
        aria-expanded={selectorOpen}
        class="w-full justify-between"
      >
        {selected !== null ? selected : "Select a selected..."}
        <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-full p-0">
      <Command.Root>
        <Command.Input placeholder="Search selected..." class="h-9" />
        {#if loading}
          <Command.Empty>Loading tables...</Command.Empty>
        {:else}
          <Command.Group>
            {#each tables as name}
              <Command.Item
                value={name}
                onSelect={(currentValue) => {
                  selected = currentValue;
                  closeAndFocusTrigger(ids.trigger);
                }}
              >
                <Check
                  class={cn(
                    "mr-2 h-4 w-4",
                    selected !== name && "text-transparent"
                  )}
                />
                {name}
              </Command.Item>
            {/each}
          </Command.Group>
        {/if}
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</div>
