<script lang="ts">
  import Home from "./pages/Home.svelte";
  import BackLog from "./pages/Backlog.svelte";
  import { Router, type RouteConfig } from "@mateothegreat/svelte5-router";
  import Ticket from "./pages/Ticket.svelte";
  import Nav from "./components/layout/Nav.svelte";
  import CreateTicket from "./pages/CreateTicket.svelte";
  const routes: RouteConfig[] = [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/backlog",
      component: BackLog,
    },
    {
      path: "/new/ticket",
      component: CreateTicket,
    },
    {
      path: "/tickets/(?<id>.*)",
      component: Ticket,
    },
  ];
</script>

<Nav />
<main class="f1 f">
  <Router {routes} />
</main>
