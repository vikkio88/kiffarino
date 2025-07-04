<script lang="ts">
  import Board from "../components/board/Board.svelte";
  import logo from "../assets/favicon.svg";
</script>

<Board />

<div class="bottom">
  <span>
    <a href="https://github.com/vikkio88/kiffarino" target="_blank">
      <img class="logo" src={logo} alt="Kiffarino Logo" /> kiffarino
    </a>
  </span>
</div>

<style>
  .bottom {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 1rem;
    bottom: 0;
    width: 100%;
    font-size: small;
  }
  .bottom > span > a {
    color: var(--gray-1-color);
  }

  .bottom > span > a:hover {
    color: var(--primary-color);
  }

  .logo {
    width: 1rem;
  }
</style>
