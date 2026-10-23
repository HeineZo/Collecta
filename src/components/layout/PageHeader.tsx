interface PageHeaderProps {
  title: string | undefined;
  description: string | undefined;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section className="page-header mt-6 flex flex-col gap-3 md:mt-10">
      <h1 className="min-h-[1lh] text-[42px] leading-[1.02] tracking-[-0.035em] md:text-[64px]">{title}</h1>
      <p className="min-h-[1lh] text-[15px] text-muted md:text-[17px]">{description}</p>
    </section>
  );
}
