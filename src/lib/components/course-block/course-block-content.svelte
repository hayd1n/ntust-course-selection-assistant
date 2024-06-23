<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card/";
  import {
    BookCheck,
    CalendarDays,
    Clock,
    Sparkle,
    Users,
  } from "lucide-svelte";
</script>

<HoverCard.Content
  class="w-80 bg-background text-foreground absolute"
  {...$$restProps}
>
  <div class="flex justify-between space-x-4">
    <div class="space-y-1">
      <h4 class="text-sm font-semibold">CS1003301 Computer Programming</h4>
      <p class="text-sm">Chih-Yuan Yao</p>
      <div class="flex items-center pt-2 text-nowrap">
        <Sparkle class="mr-2 h-4 w-4 opacity-70" />
        <span class="text-xs text-muted-foreground">3 credits</span>
      </div>
      <div class="flex items-center pt-2 text-nowrap">
        <Clock class="mr-2 h-4 w-4 opacity-70" />
        <span class="text-xs text-muted-foreground">3 / 0 hours</span>
      </div>
      <div class="flex items-center pt-2 text-nowrap">
        <BookCheck class="mr-2 h-4 w-4 opacity-70" />
        <span class="text-xs text-muted-foreground">Required / Half Yr.</span>
      </div>
      <div class="flex items-center pt-2 text-nowrap">
        <Users class="mr-2 h-4 w-4 opacity-70" />
        <span class="text-xs text-muted-foreground">0 (0 / 0)</span>
      </div>
      <div class="flex items-center pt-2 text-nowrap">
        <CalendarDays class="mr-2 h-4 w-4 opacity-70" />
        <span class="text-xs text-muted-foreground">W6() W7() W8()</span>
      </div>
    </div>
  </div>
</HoverCard.Content>
