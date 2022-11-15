<script lang="ts">
  import { quartOut } from "svelte/easing";

  import { notifications } from "../store/store";
  import { NotificationLevel } from "../types/notification";

  const { Error, Info, Trace } = NotificationLevel;

  const levelString = (level: NotificationLevel) => {
    switch (level) {
      case Error:
        return "error";
      case Info:
        return "info";
      case Trace:
        return "trace";
    }
  };

  const slideLeft = (node: HTMLElement, params?: { delay?: number }) => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    return {
      delay: params.delay || 400,
      duration: 400,
      easing: quartOut,
      css: (t: number, u: number) => `
        transform: ${transform} translateX(${2 * u}rem) scale(${t});
      `,
    };
  };

  type TimedDismissParams = { id: number; haltTimer: boolean };

  const dismissDelay = 5000;
  const timedDismiss = (_node: HTMLElement, { id }: TimedDismissParams) => {
    let timeout = setTimeout(() => {
      notifications.changeVisibility(id, false);
    }, dismissDelay);

    return {
      update: async ({ id, haltTimer }: TimedDismissParams) => {
        switch (haltTimer) {
          case true:
            notifications.changeVisibility(id, true);

            clearTimeout(timeout);
            timeout = null;

            break;
          case false:
            if (timeout == null) {
              timeout = setTimeout(() => {
                notifications.changeVisibility(id, false);
              }, dismissDelay);
            }

            break;
        }
      },
    };
  };

  export let id: number;
  export let visible: boolean;
  export let level: NotificationLevel;
  export let message: string;

  let haltTimer = false;
</script>

<div
  class="notification"
  use:timedDismiss={{ id, haltTimer }}
  on:mouseover={() => (haltTimer = true)}
  on:focus={() => (haltTimer = true)}
  on:mouseout={() => (haltTimer = false)}
  on:blur={() => (haltTimer = false)}
>
  {#if visible}
    <span class={`${levelString(level)} level-marker`} transition:slideLeft />
  {/if}
  {message}
</div>

<style lang="scss">
  .notification {
    position: relative;

    background: hsl(var(--card-background));
    padding: 0.25rem 0.5rem;
    border-radius: 12px;

    text-align: justify;

    &:focus-within,
    &:hover {
      box-shadow: 0.25rem 0.25rem hsla(0deg, 0%, 0%, 20%);

      transition: 0.2s ease-in-out all;
    }
    transition: 0.2s ease-in-out all;
  }

  .level-marker {
    content: " ";
    text-align: center;
    height: 0.5rem;
    width: 0.5rem;
    position: absolute;
    top: 50%;
    left: 0;

    z-index: -1;

    transform: translateX(calc(-100% - 0.5rem)) translateY(-50%);
    border-radius: 100px;

    &.error {
      background-color: hsl(0, 100%, 60%);
    }

    &.info {
      background-color: hsl(120, 100%, 70%);
    }

    &.trace {
      background-color: hsl(240, 100%, 60%);
    }
  }
</style>
