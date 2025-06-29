<script lang="ts">
  import type {
    TicketStatus,
    TicketType,
  } from "@kiffarino/shared/models/ticket";
  import Edit, { type BodyFields } from "../components/tickets/Edit.svelte";
  import type { TicketInfo } from "../components/tickets/Info.svelte";
  import Info from "../components/tickets/Info.svelte";
  import { createWithRespBody as create } from "../api/tickets";
  import { goto } from "@mateothegreat/svelte5-router";

  let status: TicketStatus = $state("backlog");
  let type: TicketType = $state("task");
  let title: string = $state("");
  let body: string = $state("");

  const onInfoUpdate = (info: TicketInfo) => {
    if (info.status) status = info.status;
    if (info.type) type = info.type;
  };

  const onBodyUpdate = (fields: BodyFields) => {
    if (fields.body) body = fields.body;
    if (fields.title) title = fields.title;
  };

  const onSave = async () => {
    const ticket = { title, status, type, body };
    const result = await create(ticket);
    if (result) {
      goto(`/tickets/${result.result.id}`);
      return;
    }
    //TODO: handle error
  };
</script>

<div class="f1 pd">
  <div class="head">
    <Info {type} {status} onChange={onInfoUpdate} />
  </div>
  <Edit fields={{ title, body }} onChange={onBodyUpdate} />
</div>
<div class="bottom">
  <button
    class="n-btn"
    disabled={body.length < 1 && title.length < 2}
    onclick={onSave}
  >
    💾
  </button>
</div>

<style>
  .bottom {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding: 1rem;
    bottom: 0;
    width: 100%;
    background-color: var(--black-2-color);
  }

  .bottom > button {
    font-size: 1.5rem;
  }

  .head {
    padding: 1rem;
    background-color: var(--black-2-color);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }
</style>
