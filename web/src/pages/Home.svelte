<script lang="ts">
  import Board from "../components/board/Board.svelte";
</script>

<Board />

<div class="bottom">
  <span>
    <a href="https://github.com/vikkio88/kiffarino" target="_blank">
      🧑‍💻 kiffarino
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
</style>
