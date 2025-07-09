<script lang="ts">
  import { loadHighlightJS } from "./helpers/code";
  import md from "./simpleMd";
  type Props = { body: string };

  const { body }: Props = $props();
  $effect(loadHighlightJS);
</script>

{@html md.parse(body)}
