import { ArrowLink } from "../common/ArrowLink";

export function AppFooter() {
  return (
    <footer className="app-footer border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-8 text-sm text-muted md:px-10">
        <p>
          Data from{" "}
          <ArrowLink
            href="https://metmuseum.github.io/"
            className="app-footer__api"
          >
            The Metropolitan Museum of Art Collection API
          </ArrowLink>
        </p>
        <ArrowLink
          href="https://github.com/HeineZo/Collecta"
          className="app-footer__github"
        >
          View on GitHub
        </ArrowLink>
      </div>
    </footer>
  );
}
