<script lang="ts">
  import FPC from "../layout/FullPageCentre.svelte";
  import ListItem from "../tickets/ListItem.svelte";
  import { emojiMap } from "../tickets/status";
  import { board, move } from "../../api/tickets";
  import Spinner from "../shared/Spinner.svelte";
  import type { Board, TicketRecord, TicketStatus } from "@kiffarino/shared";

  let boardPromise = $derived(board());

  const onMove = async (ticket: TicketRecord, status: TicketStatus) => {
    //TODO: optimistic ui?
    await move(ticket.id, status);
    boardPromise = board();
  };
</script>

{#await boardPromise}
  <FPC>
    <Spinner />
  </FPC>
{:then resp}
  {#if resp}
    <div class="f c f1 pd ta-c">
      <article>
        <h3>Todo {emojiMap.todo}</h3>
        <ul>
          {#each resp.result.todo as ticket}
            <ListItem {ticket} showMoveActions {onMove} />
          {:else}
            <h4>No tickets here 🤷</h4>
          {/each}
        </ul>
      </article>

      <article>
        <h3>In Progress {emojiMap.inProgress}</h3>
        <ul>
          {#each resp.result.inProgress as ticket}
            <ListItem {ticket} showMoveActions {onMove} />
          {:else}
            <h4>No tickets here 🤷</h4>
          {/each}
        </ul>
      </article>

      <article>
        <h3>Done {emojiMap.done}</h3>
        <ul>
          {#each resp.result.done as ticket}
            <ListItem {ticket} showMoveActions {onMove} />
          {:else}
            <h4>No tickets here 🤷</h4>
          {/each}
        </ul>
      </article>
    </div>
  {:else}
    <h1>Error whilst Loading the Board</h1>
  {/if}
{/await}

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
