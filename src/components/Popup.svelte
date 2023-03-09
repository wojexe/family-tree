<script lang="ts">
  import clone from "just-clone";

  import type { EditableFields, Person } from "../store/person";
  import { modal } from "../store/store";

  export let person: Person;
  export let onSubmit: (edits: EditableFields) => void;
  export let onDelete: () => void;

  const confirmChoice = () => {
    if (
      confirm(
        `Are you sure you want to delete "${person.getFullName()}" and all their descendants from the tree?`
      )
    ) {
      onDelete();
    }
  };

  let fields: EditableFields = {
    firstName: person.firstName,
    lastName: person.lastName,
    additionalName: person.additionalName,
    familyName: person.familyName,
    dateOfBirth:
      person.dateOfBirth == null ? { custom: false, date: "" } : clone(person.dateOfBirth),
    dateOfDeath:
      person.dateOfDeath == null ? { custom: false, date: "" } : clone(person.dateOfDeath)
  };

  const handleSubmit = async () => {
    let copied = clone(fields);

    if (copied.dateOfBirth?.date === "") {
      copied.dateOfBirth = undefined;
    }

    if (copied.dateOfDeath?.date === "") {
      copied.dateOfDeath = undefined;
    }

    // Clear empty strings
    copied = Object.fromEntries(
      Object.entries(copied).map(([key, val]) =>
        typeof val === "string" ? (val.trim() !== "" ? [key, val.trim()] : [key, null]) : [key, val]
      )
    );

    onSubmit(copied);
    modal.set(null);

    fields = {
      firstName: "",
      lastName: "",
      additionalName: "",
      familyName: "",
      dateOfBirth: { custom: false, date: "" },
      dateOfDeath: { custom: false, date: "" }
    };
  };
</script>

<form on:submit|preventDefault={handleSubmit}>
  <h2>Edit: <span>{person.getFullName()}</span></h2>

  <div class="grid">
    <label>
      <span>First name</span>
      <input required autocomplete="given-name" bind:value={fields.firstName} />
    </label>
    <label>
      <span>Additional name</span>
      <input autocomplete="additional-name" bind:value={fields.additionalName} />
    </label>
    <label>
      <span>Last name</span>
      <input required autocomplete="family-name" bind:value={fields.lastName} />
    </label>
    <label>
      <span>Family Name</span>
      <input autocomplete="off" bind:value={fields.familyName} />
    </label>
    <div class="custom-dates">
      <div>
        <input id="birth" type="checkbox" bind:checked={fields.dateOfBirth.custom} />
        <label for="birth"><span>Birth</span></label>
      </div>
      <div>
        <input id="death" type="checkbox" bind:checked={fields.dateOfDeath.custom} />
        <label for="death"><span>Death</span></label>
      </div>
    </div>
    <label>
      <span>Date of Birth</span>
      {#if fields.dateOfBirth?.custom}
        <input type="text" bind:value={fields.dateOfBirth.date} />
      {:else}
        <input autocomplete="bday" type="date" bind:value={fields.dateOfBirth.date} />
      {/if}
    </label>
    <label>
      <span>Date of Death</span>
      {#if fields.dateOfDeath?.custom}
        <input type="text" bind:value={fields.dateOfDeath.date} />
      {:else}
        <input type="date" bind:value={fields.dateOfDeath.date} />
      {/if}
    </label>
  </div>

  <div class="buttons">
    <button type="submit">Confirm</button>
    <button type="button" on:click|preventDefault={confirmChoice} style={"border-color: red;"}
      >DELETE</button
    >
  </div>
</form>

<style lang="scss">
  .grid {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    grid-template-rows: repeat(4, auto);
    gap: 0.5rem 1rem;
  }

  .buttons {
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: repeat(2, auto);
    gap: 0.5rem 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;

    color: hsl(var(--text-color));

    button {
      align-self: center;
    }

    h2 {
      font-weight: 700;
      margin: 0;

      span {
        font-weight: 500;
      }
    }

    .custom-dates {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;

      div {
        span {
          color: hsla(var(--text-color), 70%);

          user-select: none;
          -webkit-user-select: none;

          transition: 0.1s ease-in-out all;
        }

        &:focus-within,
        &:hover {
          span {
            color: hsl(var(--text-color));
            font-weight: 500;

            transition: 0.1s ease-in-out all;
          }
        }

        &:focus-within {
          span {
            outline: auto;
            transition: 0.1s ease-in-out all;
          }
        }

        input {
          position: absolute;
          opacity: 0.00001;

          box-shadow: none;
        }

        input:checked ~ label span {
          color: hsl(var(--text-color));
          font-weight: 700;
          text-decoration: underline;

          transition: 0.1s ease-in-out all;
        }
      }
    }

    .custom-dates label,
    label {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;

      span {
        display: flex;
        flex-direction: row;

        color: hsla(var(--text-color), 70%);
        transition: 0.1s ease-in-out all;
      }

      &:focus-within {
        span {
          color: hsl(var(--text-color));

          font-weight: 600;
          transition: 0.1s ease-in-out all;
        }
      }
    }

    input {
      padding: 0.25rem 0;
      border-radius: 8px;
      border: none;

      box-shadow: var(--shadow-elevation-low);
    }

    input {
      padding: 0.25rem;
    }
  }
</style>
