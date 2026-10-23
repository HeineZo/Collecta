import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderApp } from "../test/renderApp";

const departmentRows = () => within(screen.getByRole("region", { name: "Departments" })).getAllByRole("link");

describe("DepartmentListPage", () => {
  it("lists the departments with their work counts, biggest first", async () => {
    renderApp("/");

    await screen.findByRole("heading", { name: "European Paintings" });
    expect(departmentRows().map((row) => row.textContent)).toEqual([
      "01European Paintings3 works",
      "02Egyptian Art2 works",
      "03Greek and Roman Art1 work",
    ]);
  });

  it("narrows the list to the departments matching the search", async () => {
    const user = userEvent.setup();
    renderApp("/");
    await screen.findByRole("heading", { name: "European Paintings" });

    const search = screen.getByRole("searchbox", { name: "Search a department" });
    await user.type(search, "art");
    expect(departmentRows().map((row) => row.getAttribute("href"))).toEqual(["/departments/10", "/departments/13"]);

    await user.type(search, "deco");
    expect(screen.getByText("No department matches “artdeco”.")).toBeInTheDocument();
  });

  it("shows an error and recovers when trying again", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 403 }));
    const user = userEvent.setup();
    renderApp("/");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("The Met collection could not be reached.");

    await user.click(within(alert).getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("heading", { name: "European Paintings" })).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("opens the artworks of a department", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await user.click(await screen.findByRole("heading", { name: "Egyptian Art" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Egyptian Art" })).toBeInTheDocument();
    expect(await screen.findByText("2 works · 1 on view")).toBeInTheDocument();
  });
});
