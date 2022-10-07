<script lang="ts">
  import {
    resetStore,
    importTree,
    exportTree,
    exportTreePDF,
  } from "../store/store";
</script>

<div
  style="align-self:flex-start; position: sticky; margin: 1rem; display: flex; gap: 1rem;"
>
  <button on:click={() => resetStore()}>Clear tree</button>
  <button on:click={() => importTree()}>Import tree</button>
  <button on:click={() => exportTree()}>Export tree</button>
  <button on:click={() => exportTreePDF()}>Export to PDF</button>
</div>

<style>
  @media print {
    div {
      display: none !important;
    }
  }
</style>
