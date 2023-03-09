<script lang="ts">
  import { t } from "svelte-intl-precompile";

  import { exportTree, importTree, resetStore } from "../store/store";
</script>

<div style="align-self:flex-start; position: sticky; margin: 1rem; display: flex; gap: 1rem;">
  <button on:click={() => resetStore()}>{$t("buttons.clearTree")}</button>
  <button on:click={() => importTree()}>{$t("buttons.importTree")}</button>
  <button on:click={() => exportTree()}>{$t("buttons.exportTree")}</button>
</div>

<style>
  @media print {
    div {
      display: none !important;
    }
  }
</style>
