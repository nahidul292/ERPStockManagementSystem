import type { ReactNode } from "react";

export function SectionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass overflow-hidden rounded-[var(--radius-card)] ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line/60 px-5 py-4">
      <div>
        <h3 className="font-serif text-lg leading-tight text-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-ink-faint">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "negative" | "accent";
}) {
  const valueColor =
    tone === "positive"
      ? "text-positive"
      : tone === "negative"
        ? "text-negative"
        : tone === "accent"
          ? "text-oud"
          : "text-ink";
  return (
    <SectionCard className="px-5 py-4 transition-transform duration-300 hover:-translate-y-0.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {label}
      </p>
      <p className={`tabular mt-2 text-2xl font-semibold ${valueColor}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </SectionCard>
  );
}

type BadgeTone = "neutral" | "positive" | "warn" | "info";
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  const styles: Record<BadgeTone, string> = {
    neutral: "border-line-strong bg-surface-sunken/70 text-ink-soft",
    positive: "border-positive/30 bg-positive/10 text-positive",
    warn: "border-warn/30 bg-warn/10 text-warn",
    info: "border-oud/30 bg-oud/10 text-oud",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber">
        {eyebrow}
      </p>
      <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-ink">
        {title}
      </h1>
      <p className="mt-1.5 max-w-2xl text-sm text-ink-soft">{description}</p>
    </header>
  );
}

/** Staggered fade-up wrapper for lists of blocks. */
export function Stagger({ children }: { children: ReactNode[] }) {
  return (
    <>
      {children.map((child, i) => (
        <div key={i} style={{ animation: "var(--animate-fade-up)", animationDelay: `${i * 60}ms` }}>
          {child}
        </div>
      ))}
    </>
  );
}
