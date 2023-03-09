<script lang="ts">
  import { isLoading, t } from "svelte-intl-precompile";

  import AddPerson from "$src/components/AddPerson.svelte";
  import Notifications from "$src/components/Notifications.svelte";
  import Settings from "$src/components/Settings.svelte";
  import Tree from "$src/components/Tree.svelte";
</script>

{#if $isLoading}
  Loading locale...
{:else}
  <main>
    <h1>{$t("titles.familyTreeCreator")}</h1>
    <Tree />
    <AddPerson />
    <Settings />
  </main>
{/if}

<Notifications />
