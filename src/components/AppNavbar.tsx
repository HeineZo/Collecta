import { Logo } from "./icons/Logo";

export function AppNavbar() {
  return (
    <header className="app-navbar border-b border-border">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center px-6 md:h-20 md:px-10">
        <a href="/" className="app-navbar__brand flex items-center gap-2 text-lg font-semibold tracking-tight md:text-xl">
          <Logo className="h-6 w-auto md:h-7" />
          Collecta
        </a>
      </div>
    </header>
  );
}
