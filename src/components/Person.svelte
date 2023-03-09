<script lang="ts">
  import { families, modal, people } from "../store/store";
  import type { EditableFields, Person } from "../store/person";

  import { t, date } from "svelte-intl-precompile";
  import { bind } from "svelte-simple-modal";

  import Popup from "./Popup.svelte";

  export let person: Person;
  export let id: string | null = null;

  const displayDate = ({ custom, date }: { custom: boolean; date: string }) => {
    if (custom) return date;

    return $date(new Date(date));
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

  const showModal = () => modal.set(bind(Popup, { person, onSubmit, onDelete }));
</script>

{#if person != null}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div {id} class={"person-card " + $$props.class ?? ""} on:click={showModal}>
    <div class="names">
      <span class="full-name"
        >{person.firstName}
        {person.additionalName != null ? person.additionalName : ""}
        <span class="last-name">{person.lastName}</span></span
      >
      {#if person.familyName}
        <span class="family-name"
          >{@html $t("person.birthNameFormat", {
            values: {
              birthName: `<span class="last-name">${person.familyName}</span>`
            }
          })}</span
        >
      {/if}
    </div>

    {#if person.dateOfBirth}
      <span class="date-field">
        {@html $t("person.birthFormat", {
          values: {
            date: `<span class="date">${displayDate(person.dateOfBirth)}</span>`
          }
        })}
      </span>
    {/if}
    {#if person.dateOfDeath}
      <span class="date-field">
        {@html $t("person.deathFormat", {
          values: {
            date: `<span class="date">${displayDate(person.dateOfDeath)}</span>`
          }
        })}
      </span>
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

    width: max-content;

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

      :global(.last-name) {
        font-weight: 600;
      }
    }

    .date-field {
      text-align: center;
      font-style: italic;

      :global(.date) {
        font-weight: 600;
        font-style: normal;
      }
    }
  }
</style>
