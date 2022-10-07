<script lang="ts">
  import { onMount, tick } from "svelte";
  import LeaderLine, { type Options } from "leader-line-new";

  import type { Family, Marriage } from "../types/family";
  import { arrowsContainer } from "../store/store";

  import Person from "./Person.svelte";

  export let family: Family = null;

  $: hash = family?.hash;

  let marriage: Marriage | null;
  $: marriage = family?.marriage;
  $: between = marriage?.between;

  $: [p0, p1] = between == null ? [null, null] : between;

  const arrowOptions: Options = {
    color: "hsl(var(--border-color))",
    startPlug: "arrow2",
    endPlug: "arrow2",
  };

  let connectionElement: HTMLElement;

  onMount(async () => {
    await tick();

    const left = document.getElementById(p0.hash);
    const right = document.getElementById(p1.hash);

    // TODO: Save this somewhere?
    const connection = new LeaderLine(left, right, arrowOptions);
    connectionElement = document.querySelector(
      "body > svg.leader-line:last-child"
    );

    arrowsContainer.update((el) => {
      el.appendChild(connectionElement);

      return el;
    });
  });
</script>

{#if family != null}
  <div id={hash} class="marriage">
    <Person id={p0.hash} class="left" person={p0} />
    <Person id={p1.hash} class="right" person={p1} />
  </div>
{/if}

<style lang="scss">
  .marriage {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: 1;
    align-items: center;
    width: fit-content;
    align-self: center;
    gap: 5rem;
  }
</style>
