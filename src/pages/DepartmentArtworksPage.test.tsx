import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderApp } from "../test/renderApp";

const results = () => screen.getByRole("region", { name: "Artworks" });
const artworkTitles = () => within(results()).queryAllByRole("heading").map((heading) => heading.textContent);

describe("DepartmentArtworksPage", () => {
  it("shows the department and its highlights by default", async () => {
    renderApp("/departments/11");

    expect(await screen.findByRole("heading", { level: 1, name: "European Paintings" })).toBeInTheDocument();
    expect(await screen.findByText("3 works · 1 on view")).toBeInTheDocument();
    expect(await within(results()).findByText("2 works")).toBeInTheDocument();
    await waitFor(() => expect(artworkTitles()).toEqual(["Wheat Field with Cypresses", "The Harvesters"]));
  });

  it("searches artworks by title", async () => {
    const user = userEvent.setup();
    renderApp("/departments/11");
    await within(results()).findByText("2 works");

    await user.type(screen.getByRole("searchbox", { name: "Search in European Paintings" }), "harvest");
    expect(await within(results()).findByText("1 work")).toBeInTheDocument();
    await waitFor(() => expect(artworkTitles()).toEqual(["The Harvesters"]));
  });

  it("shows every work once the highlights filter is removed", async () => {
    const user = userEvent.setup();
    renderApp("/departments/11");
    await within(results()).findByText("2 works");

    await user.click(screen.getByRole("button", { name: "Filters, 1 active" }));
    await user.click(await screen.findByRole("menuitemcheckbox", { name: "Highlights" }));

    expect(await within(results()).findByText("3 works")).toBeInTheDocument();
    await waitFor(() => expect(artworkTitles()).toContain("Study of a Tree"));
    expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();
  });

  it("tells when no artwork matches", async () => {
    renderApp("/departments/13");

    expect(await within(results()).findByText("No artwork matches these filters.")).toBeInTheDocument();
  });

  it("tells when the department does not exist", async () => {
    renderApp("/departments/999");

    expect(await screen.findByText("This department does not exist.")).toBeInTheDocument();
  });

  it("opens the detail of an artwork", async () => {
    const user = userEvent.setup();
    renderApp("/departments/11");

    await user.click(await within(results()).findByRole("heading", { name: "The Harvesters" }));
    expect(await screen.findByRole("heading", { level: 1, name: "The Harvesters" })).toBeInTheDocument();
  });
});
