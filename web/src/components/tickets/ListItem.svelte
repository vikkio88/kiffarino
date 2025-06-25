<script lang="ts">
  import type { TicketRecord } from "@kiffarino/shared";
  import Status from "./Status.svelte";

  type Props = { ticket: TicketRecord; showStatus?: boolean };

  const { ticket, showStatus = false }: Props = $props();
</script>

<li>
  <a href={`/tickets/${ticket.id}`}>{ticket.title}</a>
  {#if showStatus}
    <Status status={ticket.status} />
  {/if}
</li>

<style>
  li {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 3px solid var(--accent-faint-color);
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
</style>
