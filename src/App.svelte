<script lang="ts">
  import AddPerson from "./components/AddPerson.svelte";
  import Notifications from "./components/Notifications.svelte";
  import Settings from "./components/Settings.svelte";
  import Tree from "./components/Tree.svelte";
</script>

<main>
  <h1>Family tree generator</h1>
  <Tree />
  <AddPerson />
  <Settings />
</main>

<Notifications />
