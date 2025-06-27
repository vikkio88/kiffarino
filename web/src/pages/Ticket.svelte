<script lang="ts">
  import type { TicketStatus, TicketType } from "@kiffarino/shared";
  import { one, update, deleteTicket } from "../api/tickets";
  import FCP from "../components/layout/FullPageCentre.svelte";
  import Renderer from "../components/md/Renderer.svelte";
  import Spinner from "../components/shared/Spinner.svelte";
  import Status from "../components/tickets/Status.svelte";
  import StatusSelector from "../components/tickets/StatusSelector.svelte";
  import { ago, cd } from "../libs/dates";
  import Type from "../components/tickets/Type.svelte";
  import TypeSelector from "../components/tickets/TypeSelector.svelte";
  import ConfirmBtn from "../components/shared/ConfirmBtn.svelte";
  import { goto } from "@mateothegreat/svelte5-router";

  type Props = {
    route: {
      result: {
        path: {
          params: {
            id: string;
          };
        };
      };
    };
  };

  const { route }: Props = $props();
  let id = route.result.path.params.id;

  let getOnePromise = $state(one(id));
  let isEditable = $state(false);

  let updatedStatus: TicketStatus | undefined = undefined;
  let updatedType: TicketType | undefined = undefined;
  const onStatusChange = (status: TicketStatus) => {
    updatedStatus = status;
  };
  const onTypeChange = (type: TicketType) => {
    updatedType = type;
  };

  const saveInfo = async () => {
    if (!updatedStatus && !updatedType) {
      isEditable = false;
      return;
    }

    const result = await update(id, {
      status: updatedStatus,
      type: updatedType,
    });
    if (result) {
      getOnePromise = one(id);
    }
    isEditable = false;
  };

  const onDelete = async () => {
    const result = await deleteTicket(id);
    if (result) {
      goto("/");
    }
  };
</script>

{#await getOnePromise}
  <FCP>
    <Spinner />
  </FCP>
{:then resp}
  {#if resp?.result}
    <div class="f1 pd">
      <div class="head">
        {#if isEditable}
          <StatusSelector
            status={resp.result.status}
            onChange={onStatusChange}
          />
          <TypeSelector type={resp.result.type} onChange={onTypeChange} />
          <div class="f r g">
            <button class="n-btn" onclick={saveInfo}>💾</button>
            <button class="n-btn" onclick={() => (isEditable = false)}>
              ❌
            </button>
          </div>
        {:else}
          <Status status={resp.result.status} extended />
          <Type type={resp.result.type} extended />
          <button class="n-btn" onclick={() => (isEditable = true)}>
            ⚙️
          </button>
        {/if}
      </div>
      <h1 class="ta-c">{resp.result.title}</h1>

      <div class="body pd">
        <Renderer text={resp.result.body} />
      </div>
    </div>
    <div class="bottom">
      <div class="f c">
        <span data-tooltip={cd(resp.result.createdAt)}>
          🆕 {ago(resp.result.createdAt)}
        </span>
        <span data-tooltip={cd(resp.result.updatedAt)}>
          ✏️ {ago(resp.result.updatedAt)}
        </span>
      </div>

      <!-- <div>Links/Tags</div> -->

      <div class="f rc g_5">
        <ConfirmBtn onConfirm={onDelete}>🗑️</ConfirmBtn>
        <ConfirmBtn onConfirm={() => console.log("archive")}>🗄️</ConfirmBtn>
        <button class="n-btn">📝</button>
      </div>
    </div>
  {:else}
    <FCP>
      <h2>Error Loading</h2>
    </FCP>
  {/if}
{/await}

<style>
  .body {
    font-size: 1.2rem;
    min-height: 80%;
    overflow: auto;
  }

  .bottom {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem;
    bottom: 0;
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
