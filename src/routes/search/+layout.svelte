<script lang="ts">
  import SplitView from "../SplitView.svelte";
  import SearchSidemenu from "./SearchSidemenu.svelte";
</script>

<SplitView>
  <SearchSidemenu slot="sidemenu" />

  <slot />
</SplitView>
