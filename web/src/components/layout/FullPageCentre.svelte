<script lang="ts">
  import type { Snippet } from "svelte";
  type Props = {
    children: Snippet;
  };
  let { children }: Props = $props();
</script>

<div class="f1 f cc">
  {@render children?.()}
</div>
