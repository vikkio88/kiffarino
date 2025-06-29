<script lang="ts">
  import { goto } from "@mateothegreat/svelte5-router";
</script>

<header class="f r spb pd">
  <nav class="f g">
    <a href="/">Board</a>
    <a href="/backlog">Backlog</a>
  </nav>
  <div data-tooltip="Create Ticket" data-tooltip-position="left">
    <button class="n-btn add" onclick={() => goto("/new/ticket")}>➕</button>
  </div>
</header>

<style>
  nav > a {
    padding: 0.5rem 1rem;
    font-size: 1.4rem;
    color: var(--primary-color);
  }

  nav > a:hover {
    color: var(--primary-v1-color);
    background-color: var(--accent-v1-color);
  }

  .add {
    font-size: 1.8rem;
  }
</style>
