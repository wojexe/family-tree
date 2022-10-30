<script lang="ts">
  import { afterUpdate, tick } from "svelte";
  import LeaderLine, { type Options } from "leader-line-new";

  import type { Family, Marriage } from "../types/family";
  import { arrowsContainer, people } from "../store/store";

  import Person from "./Person.svelte";

  export let family: Family = null;

  $: hash = family?.hash;

  let marriage: Marriage | null;
  $: marriage = family?.marriage;
  $: between = marriage?.between;

  $: [p0Hash, p1Hash] = between == null ? [null, null] : between;
  $: p0 = $people.get(p0Hash);
  $: p1 = $people.get(p1Hash);

  const arrowOptions: Options = {
    color: "hsl(var(--border-color))",
    startPlug: "arrow2",
    endPlug: "arrow2",
  };

  let connectionElement: HTMLElement;

  afterUpdate(async () => {
    await tick();

    if (connectionElement != null) connectionElement.remove();

    if (p0 == null || p1 == null || p0.hash == null || p1.hash == null) return;

    const left = document.getElementById(p0.hash);
    const right = document.getElementById(p1.hash);

    if (left == null || right == null) return;

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

{#if family != null && p0 != null && p1 != null}
  <div id={hash} class="marriage">
    <Person id={p0Hash} class="left" person={p0} />
    <Person id={p1Hash} class="right" person={p1} />
  </div>
{/if}

<style lang="scss">
  .marriage {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    align-items: center;
    width: max-content;
    align-self: center;
    gap: 5rem;
  }
</style>
