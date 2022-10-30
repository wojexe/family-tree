<script lang="ts">
  import { families } from "../store/store";
  import type { Person } from "../store/person";

  import Children from "./Children.svelte";
  import Marriage from "./Marriage.svelte";
  import { default as PersonComponent } from "./Person.svelte";
  import type { Family } from "../types/family";

  export let family: Family = null;
  export let person: Person = null;

  $: children = family?.children;

  $: if (person?.marriedWith != null) {
    family = $families.get(person.marriageHash);
  }
</script>

{#if family != null}
  <section id={"section_" + family.hash} class="family">
    <Children {children} />
    <Marriage {family} />
  </section>
{:else if person != null}
  <section id={"section_" + person.hash} class="person">
    <PersonComponent id={person.hash} {person} />
  </section>
{/if}

<style lang="scss">
  .family {
    /* outline: 1px red dashed; */

    min-width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7.5rem;
  }
</style>
