<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import * as TopBar from "$lib/components/topbar";
  import SplitView from "../SplitView.svelte";
  import TableSidemenu from "./TableSidemenu.svelte";
</script>

<SplitView>
  <TableSidemenu slot="sidemenu" />
  <h1>Hello world</h1>
</SplitView>
