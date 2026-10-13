export function AppFooter() {
  return (
    <footer className="app-footer border-t border-border">
      <p className="mx-auto max-w-[1200px] px-6 py-8 text-sm text-muted md:px-10">
        Data from{" "}
        <a href="https://metmuseum.github.io/" className="underline">
          The Metropolitan Museum of Art Collection API
        </a>
        .
      </p>
    </footer>
  );
}
