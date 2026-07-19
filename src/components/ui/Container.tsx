import clsx from "clsx";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("mx-auto max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={clsx("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">{eyebrow}</span>
      )}
      <h2 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-ink-500">{description}</p>}
    </div>
  );
}
