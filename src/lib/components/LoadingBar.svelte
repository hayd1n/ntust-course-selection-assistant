<script lang="ts">
  export let variant: "default" | "rounded" = "default";
</script>

<div
  class="h-1 w-full shrink-0 bg-secondary overflow-hidden {variant === 'rounded'
    ? 'rounded'
    : ''}"
>
  <div
    class="progress w-full h-full bg-primary left-right {variant === 'rounded'
      ? 'rounded'
      : ''}"
  />
</div>

<style>
  .progress {
    animation: progress 1s infinite linear;
  }

  .left-right {
    transform-origin: 0% 50%;
  }

  @keyframes progress {
    0% {
      transform: translateX(0) scaleX(0);
    }
    40% {
      transform: translateX(0) scaleX(0.4);
    }
    80% {
      transform: translateX(100%) scaleX(0.5);
    }
    100% {
      transform: translateX(100%) scaleX(0.5);
    }
  }
</style>
