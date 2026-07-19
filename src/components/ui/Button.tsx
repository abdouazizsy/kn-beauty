import { type ButtonHTMLAttributes, type AnchorHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import clsx from "clsx";

const VARIANTS = {
  primary: "bg-ink-900 text-cream hover:bg-ink-700",
  gold: "bg-gold-500 text-white hover:bg-gold-600",
  outline: "border border-ink-900/20 text-ink-900 hover:border-ink-900 bg-transparent",
  ghost: "text-ink-900 hover:bg-nude-100",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebd5a]",
} as const;

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
} as const;

type Variant = keyof typeof VARIANTS;
type Size = keyof typeof SIZES;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button ref={ref} className={clsx(base, VARIANTS[variant], SIZES[size], className)} {...props} />
  )
);
Button.displayName = "Button";

export function LinkButton({
  href,
  className,
  variant = "primary",
  size = "md",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: Variant; size?: Size }) {
  return <Link href={href} className={clsx(base, VARIANTS[variant], SIZES[size], className)} {...props} />;
}
