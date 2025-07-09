<script lang="ts">
  import { extractYoutubeVideos } from "./helpers/youtube";

  type Props = { body: string };

  const { body }: Props = $props();

  const videoSrcs = extractYoutubeVideos(body);
</script>

{#each videoSrcs as v}
  <div class="videoContainer">
    <iframe title="YT video" src={v.embed} allowfullscreen></iframe>
  </div>
{:else}
  <h3>No youtube video in the body</h3>
{/each}

<style>
  .videoContainer {
    aspect-ratio: 16 / 9;
    width: min(50%, 720px);
    margin: 0 auto 2rem;
    overflow: hidden;
  }

  .videoContainer iframe {
    width: 100%;
    height: 100%;
    display: block;
    border: none;
  }
</style>
