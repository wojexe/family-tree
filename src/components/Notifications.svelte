<script lang="ts">
  import { flip } from "svelte/animate";
  import { quartOut } from "svelte/easing";
  import { derived } from "svelte/store";

  import { notifications } from "../store/store";
  import Notification from "./Notification.svelte";

  const visibleNotifications = derived(notifications, (notifs) =>
    Array.from(notifs).filter(([_, notif]) => notif.visible !== false)
  );

  const slideUp = (node: HTMLElement, _params?: object) => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    return {
      duration: 400,
      easing: quartOut,
      css: (t: number, u: number) => `
        transform: ${transform} scale(${Math.max(0.8, t)}) translateY(${u * 50}px);
        opacity: ${Math.max(0.6, t)}
    `
    };
  };

  const slideRight = (node: HTMLElement, _params?: object) => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    return {
      duration: 400,
      easing: quartOut,
      css: (t: number, u: number) => `
        transform: ${transform} translateX(${100 * u}%) scale(${0.8 + t * 0.2});
        opacity: ${t};
      `
    };
  };
</script>

<div class="notification-box">
  {#each [...$visibleNotifications] as [_, { id, level, message, visible }] (id)}
    <span
      animate:flip={{
        duration: (d) => Math.sqrt(d * 5000),
        easing: quartOut
      }}
      in:slideUp
      out:slideRight
    >
      <Notification {id} {visible} {level} {message} />
    </span>
  {/each}
</div>

<style lang="scss">
  .notification-box {
    position: fixed;
    right: 0;
    bottom: 0;

    width: 33%;

    margin: 1rem;

    display: flex;
    flex-direction: column;
    align-items: flex-end;

    gap: 0.5rem;

    z-index: 100;
  }

  @media print {
    .notification-box {
      display: none;
    }
  }
</style>
