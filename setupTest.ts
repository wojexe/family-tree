import "@testing-library/jest-dom/vitest";
import "./src/i18n";

import { vi } from "vitest";

vi.mock("@macfja/svelte-persistent-store", async (importOriginal) => {
  const actual = (await importOriginal()) as any;

  return {
    ...actual,
    addSerializableClass: (_: any) => {},
    createLocalStorage: (_: any) => {},
    persist: (store: any, _storage: any, _key: any) => store,
  };
});
