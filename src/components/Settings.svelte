<script lang="ts">
  import { _ } from "svelte-i18n";
  import { resetStore, importTree, exportTree } from "../store/store";
</script>

<div
  style="align-self:flex-start; position: sticky; margin: 1rem; display: flex; gap: 1rem;"
>
  <button on:click={() => resetStore()}>{$_("buttons.clearTree")}</button>
  <button on:click={() => importTree()}>{$_("buttons.importTree")}</button>
  <button on:click={() => exportTree()}>{$_("buttons.exportTree")}</button>
</div>

<style>
  @media print {
    div {
      display: none !important;
    }
  }
</style>
