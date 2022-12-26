<script lang="ts">
  import { _, isLoading } from "svelte-i18n";

  import AddPerson from "./components/AddPerson.svelte";
  import Notifications from "./components/Notifications.svelte";
  import Settings from "./components/Settings.svelte";
  import Tree from "./components/Tree.svelte";
</script>

{#if $isLoading}
  Loading locale...
{:else}
  <main>
    <h1>{$_("titles.familyTreeCreator")}</h1>
    <Tree />
    <AddPerson />
    <Settings />
  </main>
{/if}

<Notifications />
