<script lang="ts">
  import type { TitledLink } from "@kiffarino/shared";
  import { typeEmojiMap, typeLabelMap } from "./linkType";

  type Props = { links: TitledLink[] };

  const { links }: Props = $props();

  const hasNoLinks = links.length < 1;
</script>

<div class="wrapper">
  <ul>
    {#each links as link}
      <li>
        <div
          class="link"
          data-tooltip={typeLabelMap[link.type]}
          data-tooltip-position="right"
        >
          <a href={`/tickets/${link.linkedId}`}>
            {link.title}
          </a>
          {typeEmojiMap[link.type]}
        </div>
      </li>
    {/each}
  </ul>
  <button class="n-btn" class:hasNoLinks> Add Link 🖇️ </button>
</div>

<style>
  .wrapper {
    padding: var(--pad);
    position: absolute;
    border: var(--borders);
    border-radius: var(--border-radius);
    background-color: var(--black-2-color);
    width: 250px;
  }

  button.n-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--primary-color);
    margin-top: 1rem;
  }
  button.n-btn:hover {
    color: var(--primary-v1-color);
  }

  .hasNoLinks {
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  li {
    display: flex;
  }

  .link {
    cursor: pointer;
    background-color: var(--main-bg-color);
    border: 1px solid var(--accent-faint-color);
    border-radius: var(--border-radius);
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    flex: 1;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition:
      background-color 0.3s,
      border-color 0.3s;
  }

  .link a {
    flex: 1;
    color: var(--main-font-color);
    text-decoration: none;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .link a:hover,
  .link a:focus {
    color: var(--primary-color);
    text-decoration: underline;
  }
</style>
