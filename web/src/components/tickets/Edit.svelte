<script lang="ts">
  // import type { TitledLink } from "@kiffarino/shared";

  export type BodyFields = { title?: string; body?: string };

  type Props = {
    fields: BodyFields;
    onChange: (props: BodyFields) => void;
  };

  const { fields: ticket, onChange }: Props = $props();
  let title = $state<string>(ticket.title || "");
  let body = $state<string>(ticket.body || "");

  // let links = $state<TitledLink[]>([]);
</script>

<input
  onchange={() => onChange({ title })}
  bind:value={title}
  placeholder="Ticket Title..."
/>

<div class="body pd">
  <textarea
    onchange={() => onChange({ body })}
    bind:value={body}
    placeholder="Add a description..."
  ></textarea>
</div>

<style>
  .body {
    font-size: 1.2rem;
    height: 70%;
    overflow: auto;
  }

  input {
    margin-top: 1rem;
    padding: 0.5rem;
    font-family: inherit;
    font-size: inherit;
    background-color: var(--black-2-color);
    color: var(--main-font-color);
    border: none;
    font-size: 2.5rem;
    text-align: center;
    width: 100%;
  }

  textarea {
    width: 100%;
    height: 90%;
    resize: none;
    border: none;
    padding: 1rem;
    font-family: inherit;
    font-size: inherit;
    background-color: var(--black-2-color);
    color: var(--main-font-color);
  }
</style>
