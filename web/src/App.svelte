<script lang="ts">
  import Home from "./pages/Home.svelte";
  import About from "./pages/About.svelte";
  import { Router, type RouteConfig } from "@mateothegreat/svelte5-router";
  import Tickets from "./pages/Tickets.svelte";
  const routes: RouteConfig[] = [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/about",
      component: About,
    },
    {
      path: "/tickets/(?<id>.*)",
      component: Tickets,
    },
  ];
</script>

<header>
  <nav>
    <a href="/">Home</a>
    <a href="/about">about</a>
    <a href="/tickets/123aaa">tickets</a>
  </nav>
</header>
<main class="f1">
  <Router {routes} />
</main>
