<script lang="ts">
  import type { TicketRecord } from "@kiffarino/shared";
  import Status from "./Status.svelte";

  type Props = {
    ticket: TicketRecord;
    showStatus?: boolean;
    showMoveActions?: boolean;
    onMove?: (ticket: TicketRecord, direction: "up" | "down") => void;
  };

  const {
    ticket,
    showStatus = false,
    showMoveActions = false,
    onMove = (t: TicketRecord, direction: "up" | "down") =>
      console.log({ t, direction }),
  }: Props = $props();
</script>

<li>
  {#if showStatus}
    <Status status={ticket.status} />
  {/if}
  <a href={`/tickets/${ticket.id}`}>{ticket.title}</a>
  {#if showMoveActions}
    <div class="move f r c g">
      <button
        disabled={ticket.status === "idea"}
        class="small n-btn"
        onclick={() => onMove(ticket, "up")}
      >
        ⬆️
      </button>
      <button
        disabled={ticket.status === "done"}
        class="small n-btn"
        onclick={() => onMove(ticket, "down")}
      >
        ⬇️
      </button>
    </div>
  {/if}
</li>

<style>
  li {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--black-2-color);
  }

  li:hover {
    background-color: var(--black-1-color);
  }

  li:hover > .move {
    visibility: visible;
  }

  a {
    flex: 1;
    text-align: center;
    color: var(--main-font-color);
    font-weight: bold;
  }

  a:hover {
    text-decoration: underline;
  }

  .move {
    visibility: hidden;
  }
</style>
