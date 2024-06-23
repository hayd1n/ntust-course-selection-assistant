<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card/";
</script>

<HoverCard.Root closeDelay={0} {...$$restProps}>
  <slot />
</HoverCard.Root>
