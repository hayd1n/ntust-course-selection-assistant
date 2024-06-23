<script lang="ts">
  import { onMount } from "svelte";
  import SplitView from "../SplitView.svelte";
  import TableSidemenu from "./TableSidemenu.svelte";
  import { getStateSelectedTable, getStoreAllTables } from "$lib/storage";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  onMount(async () => {
    if ($page.url.pathname.startsWith("/tables/table")) return;

    const selectedTable = await getStateSelectedTable();
    if (selectedTable) {
      goto(`/tables/table?name=${selectedTable}`);
      return;
    }

    const allTables = await getStoreAllTables();
    if (allTables && allTables.length > 0) {
      goto(`/tables/table?name=${allTables[0]}`);
      return;
    }
  });
</script>

<SplitView>
  <TableSidemenu slot="sidemenu" />

  <slot />
</SplitView>
