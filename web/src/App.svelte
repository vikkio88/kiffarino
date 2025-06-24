<script lang="ts">
  import Home from "./pages/Home.svelte";
  import BackLog from "./pages/Backlog.svelte";
  import { Router, type RouteConfig } from "@mateothegreat/svelte5-router";
  import Tickets from "./pages/Tickets.svelte";
  import Nav from "./components/layout/Nav.svelte";
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
      path: "/tickets/(?<id>.*)",
      component: Tickets,
    },
    
  ];
</script>

<Nav />
<main class="f1 f">
  <Router {routes} />
</main>
