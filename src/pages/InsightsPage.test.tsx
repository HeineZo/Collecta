import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderApp } from "../test/renderApp";

describe("InsightsPage", () => {
  it("shows the key figures of the whole collection", async () => {
    renderApp("/insights");

    expect(await screen.findByText("in the Met collection")).toBeInTheDocument();
    expect(screen.getByText("50% of the collection")).toBeInTheDocument();
    expect(screen.getByText("33% of the collection")).toBeInTheDocument();
    expect(screen.getByText("67% of the collection")).toBeInTheDocument();
  });

  it("narrows the figures to the chosen department and links to its works", async () => {
    const user = userEvent.setup();
    renderApp("/insights");

    await user.click(await screen.findByRole("button", { name: /All departments/ }));
    await user.click(await screen.findByRole("option", { name: "Egyptian Art" }));

    expect(await screen.findByText("in this department")).toBeInTheDocument();
    // 1 highlight, 1 on view and 2 works with an image out of 2.
    expect(screen.getAllByText("50% of its works")).toHaveLength(2);
    expect(screen.getByText("100% of its works")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Highlights in this department" })).toHaveAttribute(
      "href",
      "/departments/10?filters=isHighlight",
    );
  });
});
