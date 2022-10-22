import { writable, type Readable } from "svelte/store";
import {
  persist,
  createLocalStorage,
  addSerializableClass,
} from "@macfja/svelte-persistent-store";

import { Person } from "./person";
// @ts-ignore
addSerializableClass(Person);

import { families, notifications } from "./store";

interface ReadablePeople<T> extends Readable<T> {
  add: (person: PersonForm) => Promise<void>;
  has: (data?: { person?: Person; hash?: string }) => boolean;
  remove: (person: Person) => void;
  /** Update possibly obsolete connections in svelte persist store */
  regen: (person: Person) => void;
  update: () => void;
  clear: () => void;
}

export const createPeople = (): ReadablePeople<Map<string, Person>> => {
  const people = persist(
    writable(new Map<string, Person>()),
    createLocalStorage(true),
    "people"
  );

  const add = async (data: PersonForm) => {
    let hash: string;
    let person: Person;

    try {
      const personGenerator = Person.create(data);

      hash = (await personGenerator.next()).value as string;

      // Add the person's hash to the map
      people.update((map) => {
        map.set(hash, null);

        return map;
      });

      person = (await personGenerator.next()).value as Person;
    } catch (e) {
      // Delete eventually existing person's hash
      people.update((map) => {
        map.delete(hash);

        return map;
      });

      notifications.sendError(e);
    }

    // Add the person to the map
    people.update((map) => {
      map.set(person.hash, person);

      return map;
    });

    notifications.sendInfo(`${person.getFullNameAbbr()} successfully added!`);
  };

  const has = (data?: { person?: Person; hash?: string }) => {
    let result: boolean;

    people.subscribe(
      (map) => (result = map.has(data.person.hash ?? data.hash ?? "nope"))
    )();

    return result;
  };

  const remove = (person: Person) => {
    people.update((map) => {
      map.delete(person.hash);

      return map;
    });
  };

  const regen = (person: Person) => {
    people.update((map) => map.set(person.hash, person));
    if (person.childOf) {
    }
  };

  const update = () => {
    people.update((map) => map);
  };

  /** Also clears **families** store */
  const clear = () => {
    people.set(new Map<string, Person>());

    people.delete();

    families.clear();

    notifications.sendTrace("People storage cleared.");
  };

  const { subscribe } = people;

  return { add, has, remove, regen, update, clear, subscribe };
};
