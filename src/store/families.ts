import { writable, type Readable } from "svelte/store";
import { persistBrowserLocal } from "@macfja/svelte-persistent-store";

import type { Family } from "../types/family";
import type { Person } from "./person";

import { firstFamilyHash, notifications } from "./store";

interface ReadableFamily<T> extends Readable<T> {
  add: (p1: Person, p2: Person) => Promise<void>;
  addChild: (person: Person) => void;
  has: (data?: { person?: Person; hash?: string }) => boolean;
  clear: () => void;
}

export const createFamilies = (): ReadableFamily<Map<string, Family>> => {
  const families = persistBrowserLocal(
    writable(new Map<string, Family>()),
    "families"
  );

  const add = async (p1: Person, p2: Person) => {
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
        marriage: { between: [p1, p2] },
        children: new Array<Person>(),
      };

      if (map.size === 0) {
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

        family.children = [person, ...family.children];
      } else {
        throw new Error("Adding a child failed - marriage does not exist.");
      }

      return map;
    });

    notifications.sendInfo("Child successfully added!");
  };

  const has = (data?: { person?: Person; hash?: string }) => {
    let result: boolean;

    families.subscribe(
      (map) =>
        (result = map.has(data.person.marriageHash ?? data.hash ?? "nope"))
    )();

    return result;
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
    has,
    clear,
    subscribe,
  };
};
