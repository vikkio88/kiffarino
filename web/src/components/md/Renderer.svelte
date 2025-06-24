<script lang="ts">
  import md from "./renderer";
  type Props = {
    text: string;
  };
  const { text }: Props = $props();

  const parsed = $derived(md.parse(text));
</script>

{@html parsed}
