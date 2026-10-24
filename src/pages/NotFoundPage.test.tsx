import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderApp } from "../test/renderApp";

describe("NotFoundPage", () => {
  it("shows the way back to the collection on an unknown address", async () => {
    renderApp("/somewhere/that/does/not/exist");

    expect(await screen.findByRole("heading", { level: 1, name: "You took a staircase to nowhere." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Find the way out" })).toHaveAttribute("href", "/");
  });
});
