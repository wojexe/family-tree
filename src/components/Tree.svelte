<script lang="ts">
  import { modal } from "../store/store";
  import { Modal } from "svelte-simple-modal";

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

  /*
   * Personally I found this *feature* to be more distracting, than useful...
  const scrollToMiddle = async () => {
    await tick();

    adjustArrows();

    return;

    const marriageElementRect = document
      .getElementById(firstFamily.hash)
      ?.getBoundingClientRect();

    if (marriageElementRect == null) {
      // This error will always occur when the first family is created
      throw new Error("Marriage element not found.");
    }

    const { left, width } = marriageElementRect;
    const scrollOffset = left + width / 2 - window.innerWidth / 2;

    const treeWrapper = document.getElementById("tree").children[0];

    treeWrapper.scroll({ left: scrollOffset, behavior: "smooth" });
  };
  */

  $: if (firstFamily != null && firstFamily.hash != null) {
    const execute = async () => {
      try {
        await tick();
        adjustArrows();
      } catch (e) {
        notifications.sendError(e);
      }
    };

    execute();
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
      ${-getContentLeft(wrapper) + wrapper.scrollLeft}px,
      ${-getContentBottom(wrapper) - scrollY}px)`;
  };

  onMount(async () => {
    $arrowsContainer = arrows;
    $treeContainer = tree;

    adjustArrows();

    const resizeObserver = new ResizeObserver(() => adjustArrows());

    resizeObserver.observe(wrapper);

    return () => {
      resizeObserver.unobserve(wrapper);
    };
  });

  afterUpdate(() => adjustArrows());
</script>

<div
  bind:this={tree}
  id="tree"
  style={firstFamily != null ? "" : "display: none"}
>
  <div bind:this={wrapper} class="wrapper">
    <Modal
      show={$modal}
      classWindow="modal"
      styleWindow={{
        backgroundColor: "hsl(var(--card-background))",
        borderRadius: "32px",
        width: "max-content",
        padding: 0,
      }}
    >
      <Family family={firstFamily} />
    </Modal>
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
    :global(html) {
      margin: 0;
      padding: 0;
    }

    :global(body) {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    #tree {
      /* width: 100%; */
      margin: 0;
      overflow: visible;

      .wrapper {
        /* width: 100%; */
        padding: 0;
        margin: 0;
        border: none;

        overflow: visible;

        /* outline: 3px solid red; */
      }
    }
  }
</style>
