import clone from "just-clone";
import compare from "just-compare";

import { nanoid } from "nanoid/non-secure";

import type { Family } from "../types/family";
import { families, notifications, people } from "./store";

export interface EditableFields {
  firstName?: string;
  additionalName?: string;
  lastName?: string;
  familyName?: string;
  dateOfBirth?: { custom: boolean; date: string };
  dateOfDeath?: { custom: boolean; date: string };

  // TODO: edit marriage
  // marriedWith?: string;
  // marriageHash?: string;

  // TODO: edit childOf
  // childOf?: string;
}

export class Person {
  private _hash: string;

  private _firstName: string;
  private _lastName: string;

  private _additionalName?: string;
  private _familyName?: string;

  private _dateOfBirth?: { custom: boolean; date: string };
  private _dateOfDeath?: { custom: boolean; date: string };

  private _marriedWith?: Person; // TODO: maybe make an array to allow multiple marriages?
  private _marriageHash?: string;

  /** Limits the marriage to happen only once */
  private _married = false;
  public get married(): boolean {
    return this._married;
  }
  public set married(value: boolean) {
    this._married = value;
  }

  private _childOf?: string;

  // Make this private, accessible by methods
  // public _arrows?: { from: Array<any>; to: Array<any> } = {
  //   from: new Array<any>(),
  //   to: new Array<any>(),
  // };

  public get hash(): string {
    return this._hash;
  }
  public get firstName() {
    return this._firstName;
  }
  public set firstName(value: string) {
    this._firstName = value;
  }
  public get lastName() {
    return this._lastName;
  }
  public set lastName(value: string) {
    this._lastName = value;
  }
  public get additionalName() {
    return this._additionalName;
  }
  public set additionalName(value: string) {
    this._additionalName = value;
  }
  public get familyName() {
    return this._familyName;
  }
  public set familyName(value: string) {
    this._familyName = value;
  }
  public get dateOfBirth() {
    return this._dateOfBirth;
  }
  public set dateOfBirth(value: { custom: boolean; date: string }) {
    this._dateOfBirth = clone(value);
  }
  public get dateOfDeath() {
    return this._dateOfDeath;
  }
  public set dateOfDeath(value: { custom: boolean; date: string }) {
    this._dateOfDeath = clone(value);
  }
  public get marriedWith() {
    return this._marriedWith;
  }
  public get marriageHash() {
    return this._marriageHash;
  }
  public get childOf() {
    return this._childOf;
  }
  public set childOf(childOf: string) {
    this._childOf = childOf;
  }
  private set marriedWith(person: Person) {
    this._marriedWith = person;
  }
  private set marriageHash(hash: string) {
    this._marriageHash = hash;
  }

  private constructor(d: PersonForm) {
    this._hash = nanoid(12);

    this._firstName = d.firstName;
    this._lastName = d.lastName;
    this._additionalName = d.additionalName ?? null;
    this._familyName = d.familyName ?? null;
    this._dateOfBirth = d.dateOfBirth ?? clone(d.dateOfBirth);
    this._dateOfDeath = d.dateOfDeath ?? clone(d.dateOfDeath);
  }

  public static async *create(data: PersonForm) {
    const person = new Person(data);

    if (people.has({ person })) {
      throw new Error(`${person.getFullNameAbbr()} already exists.`);
    }

    yield person.hash;

    // Handle marriage
    if (data.marriedWith != null) {
      let spouse: Person;
      people.subscribe((people) => (spouse = people.get(data.marriedWith)))();

      if (spouse == null) {
        throw new Error(
          `Spouse provided with ${person.getFullNameAbbr()} does not exist!`,
        );
      }

      try {
        person.marry(spouse);
      } catch (e) {
        throw e;
      }
    }

    // Handle parents
    if (data.childOf != null) {
      let parentFamily: Family;
      const unsubscribe = families.subscribe(
        (families) => (parentFamily = families.get(data.childOf)),
      );

      if (parentFamily == null) {
        throw new Error(
          `Family provided with ${person.getFullNameAbbr()} does not exist!`,
        );
      }

      person._childOf = data.childOf;

      try {
        families.addChild(person);
      } catch (e) {
        throw e;
      }

      unsubscribe();
    }

    return person;
  }

  public getFullNameAbbr() {
    return `${this.firstName.at(0)}. ${
      this.additionalName != null ? `${this.additionalName.at(0)}. ` : ""
    }${this.lastName}${this.familyName != null ? ` - ${this.familyName}` : ""}`;
  }

  public getFullName() {
    return `${this.firstName} ${
      this.additionalName != null ? `${this.additionalName} ` : ""
    }${this.lastName}${this.familyName != null ? ` - ${this.familyName}` : ""}`;
  }

  /** TODO: make editing a person possible everywhere */
  public edit(edits: EditableFields) {
    const previous = { ...this };

    Object.assign(this, edits);

    if (!compare(previous, this)) {
      people.regen(this);
      notifications.sendTrace(`${this.getFullNameAbbr()}'s data got updated.`);
    }
  }

  public remove() {
    if (this.childOf != null) {
      families.removeChild(this.childOf, this);
    }

    if (this.marriedWith != null) {
      families.removeFamily(this.marriageHash);
    }

    people.remove(this);
  }

  public marry(person: Person) {
    if (this.marriedWith != null) {
      throw new Error(`${this.getFullNameAbbr()} is already married!`);
    }

    if (person.marriedWith != null) {
      throw new Error(`${person.getFullNameAbbr()} is already married!`);
    }

    this.marriedWith = person;
    person.marriedWith = this;

    const spouse = this.marriedWith;

    if (this.marriageHash == null) {
      const marriageHash = nanoid(12);

      this.marriageHash = marriageHash;
      spouse.marriageHash = marriageHash;

      this.married = true;
      spouse.married = true;

      try {
        families.add(this, spouse);
      } catch (e) {
        throw e;
      }
    }
  }

  /** You rather don't use this...
   *
   * Clears `marriedWith`, `marriageHash` and `married` fields from both persons
   */
  public divorce() {
    if (this.marriedWith == null) {
      throw new Error(`${this.getFullNameAbbr()} not married!`);
    }

    const spouse = this.marriedWith;

    if (spouse.marriedWith == null) {
      throw new Error(`${spouse.getFullNameAbbr()} not married!`);
    }

    this.marriedWith = null;
    spouse.marriedWith = null;
    this.marriageHash = null;
    spouse.marriageHash = null;
    this.married = false;
    spouse.married = false;
  }
}
