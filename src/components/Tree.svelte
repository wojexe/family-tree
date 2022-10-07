<script lang="ts">
  // FIXME: Arrows get bugged, when changing the zoom level.

  import Family from "./Family.svelte";
  import {
    families,
    firstFamilyHash,
    arrowsContainer,
    treeContainer,
    notifications,
  } from "../store/store";
  import { tick, onMount, afterUpdate } from "svelte";

  $: firstFamily = $families.get($firstFamilyHash);

  const scrollToMiddle = async () => {
    await tick();

    const marriageElementRect = document
      .getElementById(firstFamily.hash)
      ?.getBoundingClientRect();

    if (marriageElementRect == null) {
      throw new Error("Marriage element not found.");
    }

    const { left, width } = marriageElementRect;
    const scrollOffset = left + width / 2 - window.innerWidth / 2;

    const treeWrapper = document.getElementById("tree").children[0];

    treeWrapper.scroll({ left: scrollOffset, behavior: "smooth" });
  };

  $: if (firstFamily != null && firstFamily.hash != null) {
    try {
      scrollToMiddle();
    } catch (e) {
      notifications.sendError(e);
    }
  }

  let arrows: HTMLDivElement;
  let wrapper: HTMLDivElement;
  let tree: HTMLDivElement;

  const getContentBottom = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);

    return (
      rect.bottom -
      parseFloat(style.borderBottomWidth) -
      parseFloat(style.paddingBottom)
    );
  };

  const getContentLeft = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);

    return (
      rect.left +
      parseFloat(style.borderLeftWidth) +
      parseFloat(style.paddingLeft)
    );
  };

  const adjustArrows = () => {
    arrows.style.transform = `translate(
      ${
        -getContentLeft(wrapper) -
        scrollX -
        wrapper.scrollLeft / wrapper.scrollWidth
      }px,
      ${
        -getContentBottom(wrapper) -
        scrollY -
        wrapper.scrollTop / wrapper.scrollHeight
      }px)`;
  };

  onMount(() => {
    $arrowsContainer = arrows;
    $treeContainer = tree;

    adjustArrows();

    const resizeObserver = new ResizeObserver(() => adjustArrows());
    // const mutationObserver = new MutationObserver(() => adjustArrows());

    resizeObserver.observe(wrapper);
    // mutationObserver.observe(wrapper);

    return () => {
      resizeObserver.unobserve(wrapper);
      // mutationObserver.disconnect();
    };
  });

  afterUpdate(() => adjustArrows());
</script>

<div
  bind:this={tree}
  id="tree"
  style={firstFamily != null ? "" : "display: none"}
>
  <div bind:this={wrapper} class="wrapper" on:scroll={adjustArrows}>
    <Family family={firstFamily} />
    <div bind:this={arrows} id="arrows" />
  </div>
</div>

<style lang="scss">
  #tree {
    display: flex;
    justify-content: center;
    margin: 0 1rem;
    overflow: auto;

    width: calc(100% - 4rem);

    .wrapper {
      width: 100%;
      overflow: scroll;

      padding: 1rem;

      border: 3px solid hsla(var(--border-color), 50%);
      border-radius: 3rem;

      #arrows {
        width: 0;
        height: 0;
        position: relative;
      }
    }

    border-radius: 3rem;
  }

  @media print {
    :global(body),
    #tree,
    .wrapper {
      display: block !important;
      position: relative !important;
      width: auto !important;
      height: auto !important;
      overflow: visible !important;
      margin-left: 0 !important;
    }
    /* :global(.leader-line) {
      transform: translateX(-100px);
    } */
  }
</style>
