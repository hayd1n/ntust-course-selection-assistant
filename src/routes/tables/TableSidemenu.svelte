<script lang="ts">
  import * as Sidemenu from "$lib/components/sidemenu";
  import { Button } from "$lib/components/ui/button";
</script>

<Sidemenu.Header>
  <Sidemenu.Title>Tables</Sidemenu.Title>
</Sidemenu.Header>
<Sidemenu.Content>
  <div class="w-full flex flex-col flex-nowrap gap-1">
    <Button size="sm" class="justify-start shrink-0">Table 0</Button>
    {#each { length: 10 } as _, i}
      <Button variant="ghost" size="sm" class="justify-start shrink-0"
        >Table {i}</Button
      >
    {/each}
  </div>
</Sidemenu.Content>
