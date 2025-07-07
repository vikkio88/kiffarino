<script lang="ts">
  import MdEditor from "../shared/MdEditor.svelte";

  export type BodyFields = { title?: string; body?: string };

  type Props = {
    fields: BodyFields;
    onChange: (props: BodyFields) => void;
  };

  const { fields: ticket, onChange }: Props = $props();
  let title = $state<string>(ticket.title || "");
  let body = $state<string>(ticket.body || "");
</script>

<input
  onchange={() => onChange({ title })}
  bind:value={title}
  placeholder="Ticket Title..."
/>

<div class="body pd">
  <MdEditor initialValue={body} onChange={(body) => onChange({ body })} />
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
</style>
