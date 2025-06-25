<script lang="ts">
  import type { Board } from "@kiffarino/shared/models";
  import ListItem from "../tickets/ListItem.svelte";
  import { emojiMap } from "../tickets/status";

  type Props = { board: Board };

  const { board }: Props = $props();
  console.log({ board });
</script>

<div class="f c f1 pd ta-c">
  <article>
    <h3>Todo {emojiMap.todo}</h3>
    <ul>
      {#each board.todo as ticket}
        <ListItem {ticket} showMoveActions />
      {:else}
        <h4>No tickets here 🤷</h4>
      {/each}
    </ul>
  </article>

  <article>
    <h3>In Progress {emojiMap.inProgress}</h3>
    <ul>
      {#each board.inProgress as ticket}
        <ListItem {ticket} showMoveActions />
      {:else}
        <h4>No tickets here 🤷</h4>
      {/each}
    </ul>
  </article>

  <article>
    <h3>Done {emojiMap.done}</h3>
    <ul>
      {#each board.done as ticket}
        <ListItem {ticket} showMoveActions />
      {:else}
        <h4>No tickets here 🤷</h4>
      {/each}
    </ul>
  </article>
</div>

<style>
  article {
    margin-bottom: 1.5rem;
  }
  ul {
    padding: 2rem;
  }

  h4 {
    color: var(--gray-color);
  }
</style>
