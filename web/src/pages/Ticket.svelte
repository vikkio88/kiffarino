<script lang="ts">
  import { one, deleteTicket, update, archive } from "../api/tickets";
  import FCP from "../components/layout/FullPageCentre.svelte";
  import Renderer from "../components/md/Renderer.svelte";
  import Spinner from "../components/shared/Spinner.svelte";
  import { ago, cd } from "../libs/dates";
  import ConfirmBtn from "../components/shared/ConfirmBtn.svelte";
  import { goto } from "@mateothegreat/svelte5-router";
  import Info from "../components/tickets/Info.svelte";
  import { getParam, type RouteParams } from "../libs/routing";
  import Edit, { type BodyFields } from "../components/tickets/Edit.svelte";
  import LinksEditor from "../components/tickets/LinksEditor.svelte";
  import TagsEditor from "../components/tickets/TagsEditor.svelte";

  type Props = {
    route: RouteParams<{ id: string }>;
  };
  const { route }: Props = $props();
  let id = getParam(route, "id")!;

  let getOnePromise = $state(one(id));
  let isEditingBody = $state(false);

  const onUpdate = async () => {
    const res = await update(id, { ...updateBody });
    isEditingBody = false;
    if (res) {
      refresh();
      return;
    }
    //TODO: handle error
  };

  const onDelete = async () => {
    const result = await deleteTicket(id);
    if (result) {
      goto("/");
    }
  };

  const onArchive = async () => {
    const result = await archive(id);
    if (result) {
      goto("/");
    }
  };

  let updateBody = $state<BodyFields>({});

  const onTicketUpdate = (updates: BodyFields) => {
    updateBody = {
      ...updateBody,
      ...updates,
    };
  };

  const refresh = () => {
    getOnePromise = one(id);
  };
</script>

{#await getOnePromise}
  <FCP>
    <Spinner />
  </FCP>
{:then resp}
  {#if resp?.result}
    <div class="f1 f c pd">
      <div class="ticket">
        <div class="head">
          <Info
            id={resp.result.id}
            status={resp.result.status}
            type={resp.result.type}
            onSuccess={refresh}
          />
        </div>
        {#if isEditingBody}
          <Edit fields={resp.result} onChange={onTicketUpdate} />
        {:else}
          <h1 class="ta-c">{resp.result.title}</h1>
          <div class="body pd">
            <Renderer text={resp.result.body} />
          </div>
        {/if}
      </div>
      <details open={resp.result.links.length > 0}>
        <summary>Links 🔗</summary>
        <LinksEditor links={resp.result.links} ticketId={id} />
      </details>
      <div class="bottom">
        <div class="f1 f c">
          <span data-tooltip={cd(resp.result.createdAt)}>
            🆕 {ago(resp.result.createdAt)}
          </span>
          <span data-tooltip={cd(resp.result.updatedAt)}>
            ✏️ {ago(resp.result.updatedAt)}
          </span>
        </div>

        <div class="f1 f r cc">
          <TagsEditor ticketId={id} tags={resp.result.tags} />
        </div>

        <div class="edit f1">
          {#if isEditingBody}
            <div class="bg">
              <button class="n-btn" onclick={onUpdate}> 💾 </button>
              <button class="n-btn" onclick={() => (isEditingBody = false)}>
                ❌
              </button>
            </div>
          {:else}
            <ConfirmBtn tooltip="Delete" onConfirm={onDelete}>🗑️</ConfirmBtn>
            <ConfirmBtn tooltip="Archive" onConfirm={onArchive}>🗄️</ConfirmBtn>
            <button
              data-tooltip="Edit"
              class="n-btn"
              onclick={() => (isEditingBody = true)}
            >
              📝
            </button>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <FCP>
      <h2>Error Loading</h2>
    </FCP>
  {/if}
{/await}

<style>
  .ticket {
    flex: 5;
  }
  .body {
    font-size: 1.2rem;
    height: 80%;
    overflow: auto;
  }

  .edit {
    font-size: 1.5rem;
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    justify-content: flex-end;
  }

  .edit > .n-btn {
    position: relative;
  }

  details {
    padding: var(--pad);
  }

  summary {
    font-size: 1.1rem;
    color: var(--primary-color);
  }

  .bg {
    background-color: var(--gray-1-color);
    padding: 0.1rem 0.5rem;
    border-radius: var(--border-radius);
  }
  .bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem;

    width: 100%;
    background-color: var(--black-2-color);
  }

  .head {
    padding: 1rem;
    background-color: var(--black-2-color);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
</style>
