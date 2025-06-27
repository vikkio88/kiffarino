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
  let isEditingInfo = $state(false);
  let isEditingBody = $state(false);

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
      isEditingInfo = false;
      return;
    }

    const result = await update(id, {
      status: updatedStatus,
      type: updatedType,
    });
    if (result) {
      getOnePromise = one(id);
    }
    isEditingInfo = false;
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
        {#if isEditingInfo}
          <StatusSelector
            status={resp.result.status}
            onChange={onStatusChange}
          />
          <TypeSelector type={resp.result.type} onChange={onTypeChange} />
          <div class="f r g">
            <button class="n-btn" onclick={saveInfo}>💾</button>
            <button class="n-btn" onclick={() => (isEditingInfo = false)}>
              ❌
            </button>
          </div>
        {:else}
          <Status status={resp.result.status} extended />
          <Type type={resp.result.type} extended />
          <button class="n-btn" onclick={() => (isEditingInfo = true)}>
            ⚙️
          </button>
        {/if}
      </div>

      {#if isEditingBody}
        <input value={resp.result.title} />
      {:else}
        <h1 class="ta-c">{resp.result.title}</h1>
      {/if}
      <div class="body pd">
        {#if isEditingBody}
          <textarea>{resp.result.body}</textarea>
        {:else}
          <Renderer text={resp.result.body} />
        {/if}
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

      <div class="edit f rc g" class:bg={isEditingBody}>
        {#if isEditingBody}
          <button class="n-btn" onclick={() => (isEditingBody = false)}>
            💾
          </button>
          <button class="n-btn" onclick={() => (isEditingBody = false)}>
            ❌
          </button>
        {:else}
          <ConfirmBtn onConfirm={onDelete}>🗑️</ConfirmBtn>
          <!-- TODO: Implement Delete -->
          <!-- <ConfirmBtn onConfirm={() => console.log("archive")}>🗄️</ConfirmBtn> -->
          <button class="n-btn" onclick={() => (isEditingBody = true)}>
            📝
          </button>
        {/if}
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

  .edit {
    font-size: 1.5rem;
  }

  .bg {
    background-color: var(--gray-1-color);
    padding: 0.1rem 0.5rem;
    border-radius: var(--border-radius);
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
