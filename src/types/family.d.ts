import type Person from "../store/person";

export interface Family {
  hash: string;
  marriage: Marriage;
  children: Array<Person>;
}

interface Marriage {
  between: [Person, Person];
}
