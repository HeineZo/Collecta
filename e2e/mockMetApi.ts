import { test as base } from "@playwright/test";
import { fakeMetFetch } from "../src/test/fakeMetApi";

// Every page starts with the Met API answered from the integration-test fixtures and any other
// outside request blocked (images, map tiles, fonts): runs are offline and never trip the Met's rate limit.
export const test = base.extend({
  page: async ({ page }, run) => {
    await page.route(/^https?:\/\/(?!localhost)/, (route) => route.abort());
    await page.route(/^https:\/\/collectionapi\.metmuseum\.org\//, async (route) => {
      const response = await fakeMetFetch(route.request().url());
      await route.fulfill({
        status: response.status,
        contentType: "application/json",
        headers: { "access-control-allow-origin": "*" },
        body: await response.text(),
      });
    });
    await run(page);
  },
});

export { expect } from "@playwright/test";
