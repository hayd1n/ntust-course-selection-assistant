<script lang="ts">
  export let node: HTMLTableCellElement | undefined = undefined;
</script>

<td
  class="p-2 text-center text-base select-none overflow-hidden
  [&:not(:last-child)]:border-r border-b"
  bind:this={node}
>
  <slot />
</td>
