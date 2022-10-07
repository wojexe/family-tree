<script lang="ts">
  import { onMount, tick } from "svelte";
  import LeaderLine, { type Options } from "leader-line-new";

  import { arrowsContainer, families, notifications } from "../store/store";
  import type { Person } from "../store/person";

  import Family from "./Family.svelte";

  export let children: Array<Person>;

  $: cols = children.length;

  const arrowOptions: Options = {
    color: "hsl(var(--border-color))",
    endPlug: "arrow2",
    startSocket: "top",
    endSocket: "bottom",
    startSocketGravity: 0,
    endSocketGravity: 0,
    path: "grid",
    // startSocketGravity: 50,
    // endSocketGravity: 30,
    // path: "fluid",
  };
  let connectionElement: HTMLElement;

  onMount(async () => {
    await tick();

    children.forEach((child) => {
      const source = document.getElementById(child.childOf);
      const destination =
        child.marriageHash != null
          ? document.getElementById(child.marriageHash)
          : document.getElementById(child.hash);

      if (source == null || destination == null) {
        notifications.sendError(`Arrow to ${child.getFullNameAbbr()} errored.`);
      }

      const connection = new LeaderLine(source, destination, arrowOptions);
      connectionElement = document.querySelector(
        "body > svg.leader-line:last-child"
      );

      arrowsContainer.update((el) => {
        el.appendChild(connectionElement);

        return el;
      });
    });
  });
</script>

{#if children.length !== 0}
  <div class="children" style="--cols: {cols}">
    {#each children as child}
      {@debug child}
      {#if child.marriedWith == null}
        <Family person={child} />
      {:else}
        <Family family={$families.get(child.marriageHash)} />
      {/if}
    {/each}
  </div>
{/if}

<style lang="scss">
  .children {
    width: auto;
    display: grid;
    grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
    justify-items: center;
    align-items: flex-end;
    grid-auto-rows: 1fr;
    gap: 5rem;
  }
</style>
