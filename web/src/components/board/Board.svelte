<script lang="ts">
  import type { Board } from "@kiffarino/shared/models";
  import ListItem from "../tickets/ListItem.svelte";

  type Props = { board: Board };

  const { board }: Props = $props();
  console.log({ board });
</script>

<div class="f c f1 pd">
  <h2>Todo</h2>
  <ul>
    {#each board.todo as ticket}
      <ListItem {ticket} />
    {/each}
  </ul>

  <h2>In Progress</h2>
  <ul>
    {#each board.inProgress as ticket}
      <ListItem {ticket} />
    {/each}
  </ul>

  <h2>Done</h2>
  <ul>
    {#each board.done as ticket}
      <ListItem {ticket} />
    {/each}
  </ul>
</div>

<style>
  ul {
    padding: 2rem;
  }
</style>
