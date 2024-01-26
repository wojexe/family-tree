import { faker } from "@faker-js/faker";
import {
  cleanup,
  fireEvent,
  queryByAttribute,
  render,
  screen,
} from "@testing-library/svelte";
import { nanoid } from "nanoid/non-secure";
import Person from "./../../src/components/Person.svelte";
import { Person as PersonClass } from "./../../src/store/person";

import { getDateFormatter } from "svelte-i18n";

const dateFormatter = getDateFormatter();

vi.mock("svelte-simple-modal", async (importOriginal) => {
  const original = (await importOriginal()) as any;

  return {
    ...original,
    bind: vi.fn().mockImplementation(original.bind),
  };
});

import * as SSM from "svelte-simple-modal";

describe("Person", async () => {
  let personData: PersonForm = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };

  const createPerson = async (data: PersonForm = personData) => {
    const generator = PersonClass.create(data);

    (await generator.next()).value as string;
    return (await generator.next()).value as PersonClass;
  };

  const renderPerson = async (person: PersonClass | null = null) => {
    const p = person ?? (await createPerson());

    return render(Person, { id: p.hash, person: p });
  };

  afterEach(cleanup);

  it("has proper id attribute", async () => {
    const passedID = nanoid(12);
    const person = await createPerson();

    const { container } = render(Person, { id: passedID, person });
    await renderPerson(person);

    const passedIDElement = queryByAttribute("id", container, passedID);
    const personIDElement = queryByAttribute("id", container, person.hash);

    expect(passedIDElement).toEqual(personIDElement);
  });

  it("renders firstName and lastName", async () => {
    await renderPerson();

    expect(screen.getByText(personData.firstName)).toBeInTheDocument();
    expect(screen.getByText(personData.lastName)).toBeInTheDocument();
  });

  it("renders additional name if present", async () => {
    const additionalName = faker.person.firstName();

    personData = { ...personData, additionalName };

    await renderPerson();

    const matchText = `${personData.firstName} ${additionalName}`;

    expect(screen.getByText(matchText)).toBeInTheDocument();
  });

  it("renders family name if present", async () => {
    const familyName = faker.person.lastName();

    personData = { ...personData, familyName };

    await renderPerson();

    expect(screen.getByText(familyName)).toBeInTheDocument();
  });

  describe("renders dates correctly", async () => {
    describe("for birth", async () => {
      it("when not custom", async () => {
        const birthDate = faker.date.past({ years: 50 });

        personData = {
          ...personData,
          dateOfBirth: { date: birthDate, custom: false },
        };

        const { container } = await renderPerson();

        expect(container.textContent).toContain(
          dateFormatter.format(birthDate),
        );
      });

      it("when custom", async () => {
        const customBirthDate = "około 1990 roku";

        personData = {
          ...personData,
          dateOfBirth: { date: customBirthDate, custom: true },
        };

        const { container } = await renderPerson();

        expect(container.textContent).toContain(customBirthDate);
      });
    });

    describe("for death", async () => {
      it("when not custom", async () => {
        const deathDate = faker.date.future({ years: 50 });

        personData = {
          ...personData,
          dateOfDeath: { date: deathDate, custom: false },
        };

        const { container } = await renderPerson();

        expect(container.textContent).toContain(
          dateFormatter.format(deathDate),
        );
      });

      it("when custom", async () => {
        const customDeathDate = "około 1991 roku";

        personData = {
          ...personData,
          dateOfDeath: { date: customDeathDate, custom: true },
        };

        const { container } = await renderPerson();

        expect(container.textContent).toContain(customDeathDate);
      });
    });
  });

  it("renders everything combined correctly", async () => {
    const additionalName = faker.person.firstName();
    const familyName = faker.person.lastName();
    const birthDate = faker.date.past({ years: 50 });
    const deathDate = faker.date.future({ years: 50 });

    personData = {
      ...personData,
      additionalName,
      familyName,
      dateOfBirth: { date: birthDate, custom: false },
      dateOfDeath: { date: deathDate, custom: false },
    };

    const { container } = await renderPerson();

    expect(container.textContent).toContain(personData.firstName);
    expect(container.textContent).toContain(additionalName);
    expect(container.textContent).toContain(familyName);
    expect(container.textContent).toContain(dateFormatter.format(birthDate));
    expect(container.textContent).toContain(dateFormatter.format(deathDate));
  });

  it("opens a modal when clicked", async () => {
    const bindSpy = vi.spyOn(SSM, "bind") as any;

    const person = await createPerson();

    const { container } = await renderPerson(person);

    const personElement = container.querySelector(`#${person.hash}`)!;
    await fireEvent.click(personElement);

    expect(bindSpy.mock.calls.length).toBe(1);
  });
});
