// setupTest.ts
/* eslint-disable @typescript-eslint/no-empty-function */
import matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

// Add custom jest matchers
expect.extend(matchers);
