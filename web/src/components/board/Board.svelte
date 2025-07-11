<script lang="ts">
  import ListItem from "../tickets/ListItem.svelte";
  import { emojiMap, statusLabelMap } from "../tickets/status";
  import type { Board, TicketRecord, TicketStatus } from "@kiffarino/shared";
  import ExpandInput from "../shared/ExpandInput.svelte";
  import { create, move } from "../../api/tickets";
  type Props = {
    board: Board;
    onUpdate: () => void;
  };

  const { board, onUpdate }: Props = $props();

  const columns = ["todo", "inProgress", "done"] as const;

  const onMove = async (ticket: TicketRecord, status: TicketStatus) => {
    //TODO: optimistic ui?
    await move(ticket.id, status);
    onUpdate();
  };
</script>

{#snippet fabAdd(status: TicketStatus)}
  <div class="fab">
    <ExpandInput
      onSend={async (title: string) => {
        const result = await create({ title, status });
        if (result) {
          onUpdate();
        }

        //TODO: handle error
      }}
    >
      ➕
    </ExpandInput>
  </div>
{/snippet}

<div class="f c f1 pd ta-c">
  {#each columns as status}
    <article>
      <h3>
        {statusLabelMap[status as TicketStatus]}
        {emojiMap[status as TicketStatus]}
      </h3>
      <ul>
        {#each board[status] as ticket}
          <ListItem {ticket} showMoveActions {onMove} />
        {:else}
          <h4>No tickets here 🤷</h4>
        {/each}
      </ul>
      {@render fabAdd(status)}
    </article>
  {/each}
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
