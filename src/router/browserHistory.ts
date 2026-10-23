import { NavigationType, UNSAFE_createBrowserHistory } from "react-router";

export const browserHistory = UNSAFE_createBrowserHistory({ v5Compat: true });

// The browser would restore scroll before the deferred render below lands, against the previous page.
window.history.scrollRestoration = "manual";
const scrollPositions = new Map<string, number>();
let currentKey = browserHistory.location.key;

const listen = browserHistory.listen;
browserHistory.listen = (listener) =>
  listen((update) => {
    scrollPositions.set(currentKey, window.scrollY);
    currentKey = update.location.key;
    // React renders back/forward updates synchronously, which skips view transitions: apply them just after the popstate event.
    if (update.action === NavigationType.Pop) setTimeout(() => listener(update));
    else listener(update);
  });

// Back/forward returns to where the page was left; any other navigation starts at the top.
export const restoreScroll = (locationKey: string) => window.scrollTo(0, scrollPositions.get(locationKey) ?? 0);
