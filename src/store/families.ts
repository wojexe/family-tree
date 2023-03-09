import { createLocalStorage, persist } from "@macfja/svelte-persistent-store";
import { type Readable, writable } from "svelte/store";

import type { Family } from "../types/family";
import type { Person } from "./person";
import { firstFamilyHash, notifications, people } from "./store";

interface ReadableFamily<T> extends Readable<T> {
  add: (p1: Person, p2: Person) => void;
  addChild: (person: Person) => void;
  removeChildren: (family: string) => void;
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
      throw new Error("Couldn't create a family, because provided hashes were not identical.");
    }

    const marriageHash = p1.marriageHash;

    families.update((map) => {
      if (map.has(marriageHash)) {
        throw new Error(
          `These people are already married: ${p1.getFullNameAbbr()} & ${p2.getFullNameAbbr()}`
        );
      }

      const family: Family = {
        hash: marriageHash,
        marriage: { between: [p1.hash, p2.hash] },
        children: new Array<string>()
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
    const marriageHash = person.childOf;

    families.update((map) => {
      if (map.has(marriageHash)) {
        const family = map.get(marriageHash);

        family.children = [person.hash, ...family.children];
      } else {
        throw new Error("Adding a child failed - marriage does not exist.");
      }

      return map;
    });

    notifications.sendInfo("Child successfully added!");
  };

  const removeChildren = (family: string) => {
    families.update((map) => {
      const edited = map.get(family);

      edited?.children?.forEach((child) => {
        people.subscribe((map) => {
          map.get(child).remove();
        })();
      });

      edited.children = new Array<string>();

      map.set(edited.hash, edited);

      return map;
    });
  };

  const removeChild = (family: string, person: Person) => {
    families.update((map) => {
      const edited = map.get(family);

      edited.children = edited.children.filter((el) => el !== person.hash);

      map.set(family, edited);

      return map;
    });
  };

  const removeFamily = (family: string) => {
    removeChildren(family);

    families.update((map) => {
      const edited = map.get(family);

      const [p0, _] = edited.marriage.between;

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
      (map) => (result = map.has(data.person.marriageHash ?? data.hash ?? "nope"))
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
    removeChildren,
    removeChild,
    removeFamily,
    has,
    update,
    clear,
    subscribe
  };
};
