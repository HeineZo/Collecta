import { Breadcrumbs } from "@heroui/react";

interface BreadcrumbLink {
  label: string | undefined;
  href?: string;
}

export function PageBreadcrumbs({ links }: { links: BreadcrumbLink[] }) {
  return (
    <nav aria-label="Breadcrumbs">
      <Breadcrumbs className="page-breadcrumbs flex-wrap">
        {links.map((link, index) => (
          <Breadcrumbs.Item key={index} href={link.href} className="shrink">
            {link.label}
          </Breadcrumbs.Item>
        ))}
      </Breadcrumbs>
    </nav>
  );
}
