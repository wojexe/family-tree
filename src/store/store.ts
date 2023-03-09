import { persistBrowserLocal } from "@macfja/svelte-persistent-store";
import { type Writable, writable } from "svelte/store";

import { createFamilies } from "./families";
import { createNotifications } from "./notifications";
import { createPeople } from "./people";

export const people = createPeople();
export const families = createFamilies();
export const notifications = createNotifications();

export const firstFamilyHash = persistBrowserLocal(writable<string>(), "firstFamily");

export const treeContainer = writable<HTMLDivElement>(undefined);
export const arrowsContainer = writable<HTMLDivElement>(undefined);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const modal: Writable<any> = writable(null);

export const resetStore = () => {
  people.clear();
  families.clear();

  firstFamilyHash.set("");
  firstFamilyHash.delete();

  arrowsContainer.update((el) => {
    if (arrowsContainer != null) el.innerHTML = "";

    return el;
  });

  notifications.sendTrace("Store successfully cleared");
};

export const importTree = async () => {
  notifications.sendTrace("Starting the import!");
  if (window.confirm("This will overwrite any tree you have created!")) {
    const paste = window.prompt("Paste your clipboard contents:");

    try {
      const json = JSON.parse(paste ?? "") as object;

      Object.entries(json).forEach(([key, val]: [string, string]) =>
        localStorage.setItem(key, val)
      );
    } catch (e) {
      notifications.sendError("Something bad happened while importing a tree.");
      throw e;
    }

    notifications.sendInfo("Tree successfully imported! The page will reload in 5 seconds.");

    setTimeout(() => location.reload(), 5000);
  } else {
    notifications.sendTrace("Importing tree cancelled!");
  }
};

export const exportTree = () => {
  notifications.sendTrace("Exporting tree!");

  navigator.clipboard.writeText(JSON.stringify(localStorage));
};

// export const exportTreePDF = () => {
//   notifications.sendTrace("Exporting tree to PDF.");

//   let FFH: string;
//   let unsubFFH = firstFamilyHash.subscribe((hash) => (FFH = hash));

//   let tree: HTMLDivElement;
//   let unsub = treeContainer.subscribe((el) => (tree = el));

//   if (FFH == null || tree == null) {
//     notifications.sendError("There is no tree to export yet!");

//     return;
//   }

//   notifications.sendTrace("Creating PDF.");

//   let worker = html2pdf();

//   worker
//     .set({ margin: 16, jsPDF: { format: "a3" } })
//     .from(tree)
//     .save();

//   unsub();
//   unsubFFH();

//   notifications.sendInfo("Tree successfully exported to PDF!");
// };
