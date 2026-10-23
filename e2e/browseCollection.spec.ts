import { expect, test } from "./mockMetApi";

test("browses from the department list to an artwork and back", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("region", { name: "Departments" }).getByRole("heading", { name: "Egyptian Art" }).click();

  await expect(page).toHaveURL("/departments/10");
  await expect(page.getByRole("heading", { level: 1, name: "Egyptian Art" })).toBeVisible();
  await page.getByRole("region", { name: "Artworks" }).getByRole("heading", { name: "Seated Statue of Hatshepsut" }).click();

  await expect(page).toHaveURL("/departments/10/artworks/201");
  await expect(page.getByRole("heading", { level: 1, name: "Seated Statue of Hatshepsut" })).toBeVisible();
  await expect(page.locator(".artwork-origin-map canvas")).toBeVisible();
  await expect(page.locator(".artwork-origin-map__label")).toHaveText("Egypt");

  await page.getByRole("link", { name: "Egyptian Art" }).click();
  await expect(page).toHaveURL("/departments/10");
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1, name: "Seated Statue of Hatshepsut" })).toBeVisible();
});

test("keeps the search and filters of a department in the URL", async ({ page }) => {
  await page.goto("/departments/11");
  const results = page.getByRole("region", { name: "Artworks" });
  await expect(results.getByText("2 works")).toBeVisible();

  await page.getByRole("searchbox", { name: "Search in European Paintings" }).first().fill("harvest");
  await expect(page).toHaveURL(/q=harvest/);
  await expect(results.getByRole("heading")).toHaveText(["The Harvesters"]);

  await page.reload();
  await expect(page.getByRole("searchbox", { name: "Search in European Paintings" }).first()).toHaveValue("harvest");
  await expect(results.getByRole("heading")).toHaveText(["The Harvesters"]);
});

test("draws the insights charts and opens a department from the treemap", async ({ page }) => {
  await page.goto("/insights");

  await expect(page.getByText("Works through the ages")).toBeVisible();
  await expect(page.getByText("Weight of each department")).toBeVisible();
  await page.getByRole("link", { name: "European Paintings, 3" }).click();

  await expect(page).toHaveURL("/departments/11");
  await expect(page.getByRole("heading", { level: 1, name: "European Paintings" })).toBeVisible();
});
