import { writable, type Readable } from "svelte/store";
import { persist, createLocalStorage } from "@macfja/svelte-persistent-store";

import type { Family } from "../types/family";
import type { Person } from "./person";

import { firstFamilyHash, notifications, people } from "./store";

interface ReadableFamily<T> extends Readable<T> {
  add: (p1: Person, p2: Person) => void;
  addChild: (person: Person) => void;
  detachChildren: (family: string) => void;
  removeChild: (family: string, person: Person) => void;
  removeFamily: (family: string) => void;
  has: (data?: { person?: Person; hash?: string }) => boolean;
  update: () => void;
  clear: () => void;
}

export const createFamilies = (): ReadableFamily<Map<string, Family>> => {
  const families = persist(
    writable(new Map<string, Family>()),
    createLocalStorage(true),
    "families"
  );

  const add = (p1: Person, p2: Person) => {
    if (p1.marriageHash !== p2.marriageHash) {
      throw new Error(
        "Couldn't create a family, because provided hashes were not identical."
      );
    }

    const marriageHash = p1.marriageHash;

    families.update((map) => {
      if (map.has(marriageHash)) {
        throw new Error(
          `These people are already married: ${p1.getFullNameAbbr()} & ${p2.getFullNameAbbr()}`
        );
      }

      let family: Family = {
        hash: marriageHash,
        marriage: { between: [p1.hash, p2.hash] },
        children: new Array<string>(),
      };

      if (firstFamilyHash == null || map.size === 0) {
        firstFamilyHash.set(marriageHash);
      }

      map.set(marriageHash, family);

      return map;
    });

    notifications.sendInfo("Family successfully created!");
  };

  const addChild = (person: Person) => {
    let marriageHash = person.childOf;

    families.update((map) => {
      if (map.has(marriageHash)) {
        let family = map.get(marriageHash);

        family.children = [person.hash, ...family.children];
      } else {
        throw new Error("Adding a child failed - marriage does not exist.");
      }

      return map;
    });

    notifications.sendInfo("Child successfully added!");
  };

  const detachChildren = (family: string) => {
    families.update((map) => {
      const edited = map.get(family);

      people.subscribe((map) => {
        edited.children.forEach((child) => {
          let edited: Person;
          edited = map.get(child);

          edited.childOf = null;
        });
      })();

      edited.children = new Array<string>();

      map.set(edited.hash, edited);

      return map;
    });
  };

  const removeChild = (family: string, person: Person) => {
    families.update((map) => {
      let edited = map.get(family);

      edited.children.filter((el) => el != person.hash);

      map.set(family, edited);

      return map;
    });
  };

  const removeFamily = (family: string) => {
    detachChildren(family);

    families.update((map) => {
      let edited = map.get(family);

      let [p0, _] = edited.marriage.between;

      let person: Person;
      people.subscribe((map) => (person = map.get(p0)))();

      person.divorce();

      firstFamilyHash.update((val) => (val = val === family ? null : val));

      map.delete(family);

      return map;
    });
  };

  const has = (data?: { person?: Person; hash?: string }) => {
    let result: boolean;

    families.subscribe(
      (map) =>
        (result = map.has(data.person.marriageHash ?? data.hash ?? "nope"))
    )();

    return result;
  };

  const update = () => {
    families.update((map) => map);
  };

  /** Does not clear **people** store */
  const clear = () => {
    families.set(new Map<string, Family>());

    families.delete();

    notifications.sendTrace("Family storage cleared.");
  };

  const { subscribe } = families;

  return {
    add,
    addChild,
    detachChildren,
    removeChild,
    removeFamily,
    has,
    update,
    clear,
    subscribe,
  };
};
