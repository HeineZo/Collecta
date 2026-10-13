// The Met's bot protection blocks the client IP after request bursts, so calls are queued.
const MAX_CONCURRENT_REQUESTS = 4;
let activeRequests = 0;
const waitingRequests: (() => void)[] = [];

export async function withRequestSlot<T>(run: () => Promise<T>): Promise<T> {
  if (activeRequests < MAX_CONCURRENT_REQUESTS) activeRequests++;
  else await new Promise<void>((resolve) => waitingRequests.push(resolve));
  try {
    return await run();
  } finally {
    // Hand the slot straight to the next waiting call so the limit can never be exceeded.
    const next = waitingRequests.shift();
    if (next) next();
    else activeRequests--;
  }
}
