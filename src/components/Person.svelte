<script lang="ts">
  import type { EditableFields, Person } from "../store/person";

  import { families, modal, people } from "../store/store";
  import { bind } from "svelte-simple-modal";
  import Popup from "./Popup.svelte";

  export let person: Person;
  export let id: string = null;

  const displayDate = ({ custom, date }: { custom: boolean; date: string }) => {
    if (custom) return date;

    return Intl.DateTimeFormat("pl").format(new Date(date));
  };

  const onSubmit = async (edits: EditableFields) => {
    console.log($people);

    person.edit(edits);
    person = person; // Trigger reactivity

    people.update();
    families.update();

    console.log($people);
  };

  const onDelete = () => person.remove();

  const showModal = () =>
    modal.set(bind(Popup, { person, onSubmit, onDelete }));
</script>

{#if person != null}
  <div {id} class={$$props.class + " person-card"} on:click={showModal}>
    <div class="names">
      <span class="full-name"
        >{person.firstName}
        {person.additionalName != null ? person.additionalName : ""}
        <span class="last-name">{person.lastName}</span></span
      >
      {#if person.familyName}
        <span class="family-name"
          >z d. <span class="last-name">{person.familyName}</span></span
        >
      {/if}
    </div>

    {#if person.dateOfBirth}
      <span class="date-field"
        >ur. <span class="date">{displayDate(person.dateOfBirth)}</span> r.</span
      >
    {/if}
    {#if person.dateOfDeath}
      <span class="date-field"
        >zm. <span class="date">{displayDate(person.dateOfDeath)}</span> r.</span
      >
    {/if}
  </div>
{/if}

<style lang="scss">
  :global(.modal) {
    content: "dfnakad";
    background: red;
  }
  .left {
    justify-self: flex-end;
  }

  .right {
    justify-self: flex-start;
  }

  .person-card {
    display: flex;
    flex-direction: column;
    width: fit-content;
    gap: 0.3rem;

    padding: 1rem;
    border-radius: 1.5rem;

    background-color: hsl(var(--card-background));
    border: 3px solid hsl(var(--border-color));

    &:focus-within,
    &:hover {
      box-shadow: 0.25rem 0.25rem hsla(0deg, 0%, 0%, 20%);

      transition: 0.2s ease-in-out all;
    }
    transition: 0.2s ease-in-out all;

    .names {
      display: flex;
      flex-direction: column;
      align-items: center;

      white-space: nowrap;

      .full-name {
        font-size: 1.1em;
        line-height: 1rem;
      }

      .family-name {
        position: relative;
        font-size: 0.8em;
      }

      .last-name {
        font-weight: 600;
      }
    }

    .date-field {
      text-align: center;
    }
  }
</style>
