import { faker } from "@faker-js/faker";
import {
  cleanup,
  fireEvent,
  queryByAttribute,
  render,
  screen,
} from "@testing-library/svelte";
import { nanoid } from "nanoid/non-secure";
import FamilyComponent from "./../../src/components/Family.svelte";
import { people, families } from "./../../src/store/store";
import type { Person } from "./../../src/store/person";

function generateFakePersonData(
  marriedWith: string | null = null,
  childOf: string | null = null,
): PersonForm {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dateOfBirth: {
      date: faker.date.past(),
      custom: false,
    },
    dateOfDeath: {
      date: faker.date.future(),
      custom: false,
    },
    marriedWith: marriedWith ?? undefined,
    childOf: childOf ?? undefined,
  };
}

async function generateFakePerson(
  marriedWith: string | null = null,
  childOf: string | null = null,
): Promise<Person> {
  const personData = generateFakePersonData(marriedWith, childOf);

  let map: Map<string, Person> = new Map();

  people.subscribe((m) => (map = m))();
  const before = new Set(map.keys());

  await people.add(personData);

  people.subscribe((m) => (map = m))();
  const after = [...map.keys()];

  const personID = after.filter((el) => !before.has(el))[0];

  return map.get(personID)!;
}

describe("Family", async () => {
  afterEach(cleanup);

  const P1 = await generateFakePerson();
  const P2 = await generateFakePerson(P1.hash);

  const marriageHash = P1.marriageHash;

  const C1 = await generateFakePerson(null, marriageHash);
  const C2 = await generateFakePerson(null, marriageHash);

  const additionalPerson = await generateFakePerson();

  describe("when provided a family", () => {
    let family: Family;
    families.subscribe((m) => (family = m.get(marriageHash)!))();

    it("should render the family", () => {
      const { container } = render(FamilyComponent, { family });
      const containerText = container.textContent?.replace(/\s+/g, " ");

      expect(containerText).toContain(P1.getFullName());
      expect(containerText).toContain(P2.getFullName());
      expect(containerText).toContain(C1.getFullName());
      expect(containerText).toContain(C2.getFullName());
    });

    describe("and a person", () => {
      it("should only render the family", () => {
        const { container } = render(FamilyComponent, { family });
        const containerText = container.textContent?.replace(/\s+/g, " ");

        expect(containerText).not.toContain(additionalPerson.getFullName());
      });
    });
  });

  describe("when provided a person only", () => {
    it("should render the person only", async () => {
      const { container } = render(FamilyComponent, {
        person: additionalPerson,
      });
      const containerText = container.textContent?.replace(/\s+/g, " ");

      expect(containerText).toContain(additionalPerson.getFullName());

      expect(containerText).not.toContain(P1.getFullName());
      expect(containerText).not.toContain(P2.getFullName());
      expect(containerText).not.toContain(C1.getFullName());
      expect(containerText).not.toContain(C2.getFullName());
    });
  });
});
