import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { fakeMetFetch } from "./fakeMetApi";

// jsdom has no layout engine: browser APIs the app relies on are stubbed.
// Only reduced motion matches, so animated numbers show their final value at once.
window.matchMedia = (query: string) =>
  ({
    matches: query.includes("prefers-reduced-motion: reduce"),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", NoopObserver);
vi.stubGlobal("ResizeObserver", NoopObserver);
Element.prototype.scrollIntoView = () => {};
Element.prototype.getAnimations = () => [];
window.scrollTo = () => {};

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(fakeMetFetch));
});

afterEach(cleanup);
