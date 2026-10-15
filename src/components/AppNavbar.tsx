import { useState } from "react";
import { Link, useLocation } from "react-router";
import { cn } from "../lib/cn";
import { Logo } from "./icons/Logo";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  Navbar,
  NavItems,
} from "./ui/resizable-navbar";

const MOBILE_MENU_ID = "app-navbar-mobile-menu";

export function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isInsights = useLocation().pathname.startsWith("/insights");
  const links = [
    { name: "Departments", link: "/", isActive: !isInsights },
    { name: "Insights", link: "/insights", isActive: isInsights },
  ];
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Navbar className="app-navbar">
      <NavBody className="h-20 max-w-[1200px] px-6 md:px-10">
        <AppNavbarBrand />
        <NavItems items={links} />
      </NavBody>

      <MobileNav className="app-navbar__mobile">
        <MobileNavHeader className="h-12 px-6">
          <AppNavbarBrand />
          <MobileNavToggle isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} controls={MOBILE_MENU_ID} />
        </MobileNavHeader>
        <MobileNavMenu id={MOBILE_MENU_ID} isOpen={isMenuOpen}>
          {links.map((link) => (
            <Link
              key={link.link}
              to={link.link}
              onClick={closeMenu}
              aria-current={link.isActive ? "page" : undefined}
              className={cn("text-lg text-muted", link.isActive && "text-foreground")}
            >
              {link.name}
            </Link>
          ))}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

function AppNavbarBrand() {
  return (
    <Link to="/" className="app-navbar__brand relative z-20 flex items-center gap-2 text-lg font-semibold tracking-tight md:text-xl">
      <Logo className="h-6 w-auto md:h-7" />
      Collecta
    </Link>
  );
}
