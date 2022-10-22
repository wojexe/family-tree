<script lang="ts">
  import { afterUpdate, onMount, tick } from "svelte";
  import LeaderLine, { type Options } from "leader-line-new";

  import {
    arrowsContainer,
    families,
    notifications,
    people,
  } from "../store/store";

  import Family from "./Family.svelte";

  export let children: Array<string>;
  $: childrenPeople = children
    .map((childHash) => $people.get(childHash))
    .filter((child) => child != null);

  $: cols = childrenPeople.length;

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
  let connectionElements = new Array<Element>();

  afterUpdate(async () => {
    await tick();

    connectionElements.forEach((el) => el.remove());
    connectionElements = new Array<Element>();

    childrenPeople.forEach((child) => {
      if (child == null) {
        return;
      }

      const source = document.getElementById(child.childOf);
      const destination =
        child.marriageHash != null
          ? document.getElementById(child.marriageHash)
          : document.getElementById(child.hash);

      if (source == null || destination == null) {
        const msg = `Arrow to ${child.getFullNameAbbr()} errored.`;

        notifications.sendError(msg);
        console.error(msg, source, destination);

        return;
      }

      const connection = new LeaderLine(source, destination, arrowOptions);
      let connectionElement = document.querySelector(
        "body > svg.leader-line:last-child"
      );

      arrowsContainer.update((el) => {
        el.appendChild(connectionElement);

        console.log(connection);

        return el;
      });

      connectionElements.push(connectionElement);
      // notifications.sendTrace(`Added arrow to ${child.getFullNameAbbr()}.`);
    });
  });
</script>

{#if childrenPeople.length !== 0}
  <div class="children" style="--cols: {cols}">
    {#each childrenPeople as child}
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
