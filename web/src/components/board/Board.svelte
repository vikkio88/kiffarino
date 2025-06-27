<script lang="ts">
  import FPC from "../layout/FullPageCentre.svelte";
  import ListItem from "../tickets/ListItem.svelte";
  import { emojiMap } from "../tickets/status";
  import { board, create, move } from "../../api/tickets";
  import Spinner from "../shared/Spinner.svelte";
  import type { TicketRecord, TicketStatus } from "@kiffarino/shared";
  import ExpandInput from "../shared/ExpandInput.svelte";

  let boardPromise = $derived(board());

  const onMove = async (ticket: TicketRecord, status: TicketStatus) => {
    //TODO: optimistic ui?
    await move(ticket.id, status);
    boardPromise = board();
  };
</script>

{#snippet fabAdd(status: TicketStatus)}
  <div class="fab">
    <ExpandInput
      onSend={async (title: string) => {
        const result = await create({ title, status });
        if (result) {
          boardPromise = board();
        }

        //TODO: handle error
      }}
    >
      ➕
    </ExpandInput>
  </div>
{/snippet}

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
        {@render fabAdd("todo")}
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
        {@render fabAdd("inProgress")}
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
        {@render fabAdd("done")}
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
