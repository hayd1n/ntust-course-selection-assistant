<script lang="ts">
  import * as Sidemenu from "$lib/components/sidemenu";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import * as Dialog from "$lib/components/ui/dialog";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { Button } from "$lib/components/ui/button";
  import { Plus } from "lucide-svelte";
  import { Input, type FormInputEvent } from "$lib/components/ui/input";
  import {
    TableAlreadyExistsError,
    TableNameMaxLength,
    createTable,
    deleteTable,
    duplicateTable,
    renameTable,
  } from "$lib/tables";
  import { getStoreAllTables, getStoreTable } from "$lib/storage";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { page } from "$app/stores";
  import { showMenu } from "tauri-plugin-context-menu";
  import type { Action } from "svelte/action";
  import { toast } from "svelte-sonner";
  import { gotoTable } from "$lib/navigate";

  $: tableName = $page.url.searchParams.get("name");

  let createTableDialogOpen = false;
  let deleteTableDialogOpen = false;

  let newTableName = "";
  let newTableNameIllegalTip: string | null = null;
  let getAllTablesPromise = writable(getStoreAllTables());

  let renaming: string | null = null;
  let renamingNewName = "";

  let deleting: string | null = null;

  const renameInput: Action = (el: Node) => {
    const inputEl = el as HTMLInputElement;
    inputEl?.focus();
    inputEl?.select();

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;

      handleTableRenameSubmit();
    };

    document.addEventListener("blur", handleTableRenameSubmit);
    document.addEventListener("keydown", handleKeydown);

    return {
      destroy() {
        document.removeEventListener("blur", handleTableRenameSubmit);
        document.removeEventListener("keydown", handleKeydown);
      },
    };
  };

  async function handleNewTableNameChange(e: FormInputEvent<InputEvent>) {
    const target = e.target as HTMLInputElement;
    const table = await getStoreTable(target.value);
    if (table !== undefined) {
      newTableNameIllegalTip = "Table name already in use";
      return;
    }

    newTableNameIllegalTip = null;
  }

  async function handleCreateTable() {
    const trimedNewName = newTableName.trim();

    if (trimedNewName === "") return;

    await createTable(trimedNewName);
    createTableDialogOpen = false;

    // refreshing getAllTablesPromise induces a list refresh
    getAllTablesPromise.set(getStoreAllTables());

    gotoTable(trimedNewName);

    toast.success("Table created successfully", {
      description: `${trimedNewName} was created successfully`,
    });
    newTableName = "";
  }

  function handleTableClick(name: string) {
    // don't navigate to the table if it's already selected
    if (name === tableName) return;

    // don't navigate to the table if it's renaming
    if (name === renaming) return;

    gotoTable(name);
  }

  function handleTableRenameClick(name: string) {
    renaming = name;
    renamingNewName = name;
  }

  async function handleTableDuplicateClick(name: string) {
    const duplicatedTableName = await duplicateTable(name);
    toast.success("Table duplication successful");

    // refreshing getAllTablesPromise induces a list refresh
    getAllTablesPromise.set(getStoreAllTables());

    gotoTable(duplicatedTableName);
  }

  function handleTableDeleteClick(name: string) {
    deleteTableDialogOpen = true;
    deleting = name;
  }

  async function handleTableRenameSubmit() {
    const trimedNewName = renamingNewName.trim();

    if (!renaming || trimedNewName === "" || renaming === trimedNewName) {
      renaming = null;
      return;
    }

    console.log(`renaming ${renaming} to ${trimedNewName}`);
    try {
      await renameTable(renaming, trimedNewName);
    } catch (error) {
      if (error instanceof TableAlreadyExistsError) {
        toast.error("Renaming failed", {
          description: `${renamingNewName} already in use`,
        });
        renaming = null;
        return;
      } else {
        throw error;
      }
    }

    // if the renamed table is the one currently being viewed,
    // then jump to the new table.
    if (tableName === renaming) gotoTable(trimedNewName);

    renaming = null;

    // refreshing getAllTablesPromise induces a list refresh
    getAllTablesPromise.set(getStoreAllTables());
  }

  async function handleTableDeleteSubmit() {
    if (!deleting) return;

    await deleteTable(deleting);

    // refreshing getAllTablesPromise induces a list refresh
    getAllTablesPromise.set(getStoreAllTables());

    toast.success("Table deleted successfully", {
      description: `${deleting} was deleted successfully`,
    });

    // if the deleted table is the one currently being viewed,
    // then jump to the last table.
    if (deleting === tableName) {
      const lastTable = (await getStoreAllTables())?.at(-1);
      if (lastTable) gotoTable(lastTable.name);
    }

    deleting = null;
    deleteTableDialogOpen = false;
  }

  async function handleTableContextMenu(name: string) {
    await showMenu({
      items: [
        {
          label: "Duplicate",
          event: (e) => handleTableDuplicateClick(e?.payload.name),
          payload: { name },
          shortcut: "cmd+d",
        },
        { is_separator: true },
        {
          label: "Rename",
          event: (e) => handleTableRenameClick(e?.payload.name),
          payload: { name },
          shortcut: "enter",
        },
        {
          label: "Delete",
          event: (e) => handleTableDeleteClick(e?.payload.name),
          payload: { name },
          shortcut: "delete",
        },
      ],
    });
  }
</script>

<Sidemenu.Header>
  <div class="flex flex-row flex-nowrap title-container">
    <div class="flex">
      <Sidemenu.Title>Tables</Sidemenu.Title>
    </div>
    <div class="flex grow" />
    <div class="flex create-table-button-container">
      <Tooltip.Root openDelay={0}>
        <Tooltip.Trigger asChild let:builder>
          <Button
            builders={[builder]}
            variant="ghost"
            size="icon"
            class="p-0.5 h-fit"
            on:click={() => (createTableDialogOpen = true)}
          >
            <Plus class="h-3 w-3" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>Create table</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  </div>
</Sidemenu.Header>
<Sidemenu.Content>
  <div class="w-full flex flex-col flex-nowrap gap-1">
    {#await $getAllTablesPromise then tables}
      {#if tables !== null}
        {#each tables as { name }}
          <div
            class="w-full"
            aria-hidden={false}
            on:contextmenu|preventDefault={() => handleTableContextMenu(name)}
            on:click|preventDefault={() => handleTableClick(name)}
            on:dblclick|preventDefault={() => handleTableRenameClick(name)}
          >
            <Button
              variant={$page.url.pathname.startsWith(`/tables/table`) &&
              $page.url.searchParams.get("name") === name
                ? "default"
                : "ghost"}
              size="sm"
              class="justify-start w-full shrink-0 transition-none"
            >
              {#if name === renaming}
                <input
                  type="text"
                  class="text-foreground w-full"
                  maxlength={TableNameMaxLength}
                  bind:value={renamingNewName}
                  use:renameInput
                  on:blur={handleTableRenameSubmit}
                />
              {:else}
                {name}
              {/if}
            </Button>
          </div>
        {/each}
      {/if}
    {/await}
  </div>
</Sidemenu.Content>

<!-- Create Table Dialog -->
<Dialog.Root bind:open={createTableDialogOpen}>
  <Dialog.Content>
    <form on:submit|preventDefault={handleCreateTable}>
      <Dialog.Header>
        <Dialog.Title>Create table</Dialog.Title>
        <Dialog.Description>
          Please enter a name for the new table
        </Dialog.Description>
        <div class="p-2 w-full">
          <div class="grid w-full items-center gap-1.5">
            <Input
              type="text"
              placeholder="Table"
              class="w-full"
              maxlength={TableNameMaxLength}
              bind:value={newTableName}
              on:input={handleNewTableNameChange}
            />
            {#if newTableNameIllegalTip}
              <p class="text-sm text-red-500">{newTableNameIllegalTip}</p>
            {/if}
          </div>
        </div>
      </Dialog.Header>
      <Dialog.Footer>
        <Button
          type="submit"
          disabled={newTableName.trim() === "" ||
            newTableNameIllegalTip !== null}>Create</Button
        >
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>

<!-- Delete Table Confirm Dialog -->
<AlertDialog.Root bind:open={deleteTableDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure you want to delete it?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will delete the table from your
        device.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={handleTableDeleteSubmit}
        >Delete</AlertDialog.Action
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
