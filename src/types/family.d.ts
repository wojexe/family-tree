export interface Family {
  hash: string;
  marriage: Marriage;
  children: Array<string>;
}

interface Marriage {
  between: [string, string];
}
