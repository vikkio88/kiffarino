<script lang="ts">
  import { parsePlugins, type Section } from "./parser/plugins";
  import md from "./renderers/simpleMd";
  import Youtube from "./renderers/Youtube.svelte";
  type Props = {
    text: string;
  };
  const { text }: Props = $props();

  const sections: Section[] = parsePlugins(text);
</script>

{#each sections as section}
  {#if section.plugin.name === "simple_md"}
    {@html md.parse(section.source)}
  {:else if section.plugin.name === "youtube"}
    <Youtube body={section.source} />
  {:else}
    <!-- Fallback to simple_md if no plugin -->
    {@html md.parse(section.source)}
  {/if}
{/each}
