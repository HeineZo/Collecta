import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderApp } from "../test/renderApp";

describe("ArtworkDetailPage", () => {
  it("shows the artwork with its details and a way back to its department", async () => {
    renderApp("/departments/11/artworks/101");

    expect(await screen.findByRole("heading", { level: 1, name: "Wheat Field with Cypresses" })).toBeInTheDocument();
    expect(screen.getByText("Gallery 822")).toBeInTheDocument();

    const details = screen.getByRole("heading", { name: "Details" }).parentElement!;
    expect(within(details).getByText("Oil on canvas")).toBeInTheDocument();
    expect(within(details).getByText("1993.132")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "European Paintings" })).toHaveAttribute("href", "/departments/11");
    expect(screen.getByRole("link", { name: /View on metmuseum.org/ })).toHaveAttribute(
      "href",
      "https://www.metmuseum.org/art/collection/search/101",
    );
  });

  it("shows an error when the artwork cannot be loaded", async () => {
    renderApp("/departments/11/artworks/999");

    expect(await screen.findByRole("alert")).toHaveTextContent("This artwork could not be loaded from the Met collection.");
  });
});
