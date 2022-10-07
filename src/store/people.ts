import { writable, type Readable } from "svelte/store";
import {
  persistBrowserLocal,
  addSerializableClass,
} from "@macfja/svelte-persistent-store";

import { Person } from "./person";
// @ts-ignore
addSerializableClass(Person);

import { families, notifications } from "./store";

interface ReadablePeople<T> extends Readable<T> {
  add: (person: PersonForm) => Promise<void>;
  has: (data?: { person?: Person; hash?: string }) => boolean;
  clear: () => void;
}

export const createPeople = (): ReadablePeople<Map<string, Person>> => {
  const people = persistBrowserLocal(
    writable(new Map<string, Person>()),
    "people"
  );

  const add = async (data: PersonForm) => {
    let person: Person;

    try {
      person = await Person.create(data);
    } catch (e) {
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

  /** Also clears **families** store */
  const clear = () => {
    people.set(new Map<string, Person>());

    people.delete();

    families.clear();

    notifications.sendTrace("People storage cleared.");
  };

  const { subscribe } = people;

  return { add, has, clear, subscribe };
};
