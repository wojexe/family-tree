<script lang="ts">
  import { derived } from "svelte/store";

  import { people, families as familiesStore } from "../store/store";

  const notMarried = derived(people, (people) =>
    Array.from(people)
      .filter(([_, person]) => person != null)
      .filter(([_, person]) => person?.marriedWith == null)
      .sort(([_a, a], [_b, b]) => {
        let lastNameCompare = a.lastName.localeCompare(b.lastName);

        if (lastNameCompare == 0) {
          return a.firstName.localeCompare(b.firstName);
        }

        return lastNameCompare;
      })
  );

  const families = derived(familiesStore, (families) =>
    Array.from(families).map(([_, family]) => family)
  );

  let formData: PersonForm = {
    firstName: "",
    lastName: "",
    dateOfBirth: { custom: false, date: "" },
    dateOfDeath: { custom: false, date: "" },
  };

  const handleSubmit = async () => {
    let formDataCopied = { ...formData };

    if (formDataCopied.dateOfBirth.date === "") {
      formDataCopied.dateOfBirth = null;
    }

    if (formDataCopied.dateOfDeath.date === "") {
      formDataCopied.dateOfDeath = null;
    }

    // @ts-ignore
    // Clear empty strings
    formDataCopied = Object.fromEntries(
      Object.entries(formDataCopied).map(([key, val]) =>
        typeof val === "string"
          ? val.trim() !== ""
            ? [key, val.trim()]
            : [key, null]
          : [key, val]
      )
    );

    formData = {
      firstName: "",
      lastName: "",
      dateOfBirth: { custom: false, date: "" },
      dateOfDeath: { custom: false, date: "" },
    };

    await people.add(formDataCopied);
  };

  $: console.log($people);
  $: console.log($familiesStore);
</script>

<form on:submit|preventDefault={handleSubmit}>
  <h2>Add new person</h2>

  <div class="grid">
    <label>
      <span>First name</span>
      <input
        required
        autocomplete="given-name"
        bind:value={formData.firstName}
      />
    </label>
    <label>
      <span>Additional name</span>
      <input
        autocomplete="additional-name"
        bind:value={formData.additionalName}
      />
    </label>
    <label>
      <span>Last name</span>
      <input
        required
        autocomplete="family-name"
        bind:value={formData.lastName}
      />
    </label>
    <label>
      <span>Family Name</span>
      <input autocomplete="off" bind:value={formData.familyName} />
    </label>
    <div class="custom-dates">
      <div>
        <input
          id="birth"
          type="checkbox"
          bind:checked={formData.dateOfBirth.custom}
        />
        <label for="birth"><span>Birth</span></label>
      </div>
      <div>
        <input
          id="death"
          type="checkbox"
          bind:checked={formData.dateOfDeath.custom}
        />
        <label for="death"><span>Death</span></label>
      </div>
    </div>
    <label>
      <span>Date of Birth</span>
      {#if formData.dateOfBirth.custom}
        <input type="text" bind:value={formData.dateOfBirth.date} />
      {:else}
        <input
          autocomplete="bday"
          type="date"
          bind:value={formData.dateOfBirth.date}
        />
      {/if}
    </label>
    <label>
      <span>Date of Death</span>
      {#if formData.dateOfDeath.custom}
        <input type="text" bind:value={formData.dateOfDeath.date} />
      {:else}
        <input type="date" bind:value={formData.dateOfDeath.date} />
      {/if}
    </label>
    <label>
      <span>Married with</span>
      <select
        bind:value={formData.marriedWith}
        disabled={$people.size === 0 || formData.childOf != null}
      >
        <option value={undefined} />
        <!-- TODO: What if second marriage?
              workaround: add the same person second time as a different one
        -->
        {#each $notMarried as [hash, person]}
          <option value={hash}>{person.getFullNameAbbr()}</option>
        {/each}
      </select>
    </label>
  </div>
  <label class="childOf">
    <span>Child of</span>
    <select
      bind:value={formData.childOf}
      disabled={$families.length === 0 || formData.marriedWith != null}
    >
      <option value={undefined} />
      {#each $families as { hash, marriage: { between: [p0, p1] } }}
        <option value={hash}>
          {`${$people.get(p0)?.getFullNameAbbr()} & ${$people
            .get(p1)
            ?.getFullNameAbbr()}`}
        </option>
      {/each}
    </select>
  </label>

  <button type="submit">Add</button>
</form>

<style lang="scss">
  .grid {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    grid-template-rows: repeat(4, auto);
    gap: 0.5rem 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;

    background-color: hsl(var(--card-background));
    border-radius: 32px;

    border: 3px solid hsl(var(--border-color));

    button {
      align-self: center;
    }

    h2 {
      font-weight: 700;
    }

    &:focus-within,
    &:hover {
      border-radius: 48px;
      box-shadow: 0.75rem 0.75rem hsla(0deg, 0%, 0%, 20%);

      transition: 0.2s ease-in-out all;
    }
    transition: 0.2s ease-in-out all;

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

    input,
    select {
      padding: 0.25rem 0;
      border-radius: 8px;
      border: none;

      box-shadow: var(--shadow-elevation-low);
    }

    select {
      position: relative;
      padding: 0.25rem 1rem 0.25rem 0.5rem;
    }

    input {
      padding: 0.25rem;
    }

    h2 {
      margin: 0;
      text-align: center;
    }
  }

  @media print {
    form {
      display: none !important;
    }
  }
</style>
