import clsx from "clsx";
import {
  Sparkles,
  Scissors,
  Gem,
  Wand2,
  Shirt,
  Gift,
  Images,
  type LucideIcon,
} from "lucide-react";

type ArtKind =
  | "maquillage"
  | "coiffure"
  | "onglerie"
  | "beaute"
  | "pyjamas"
  | "accessoires"
  | "produits-beaute"
  | "ongles"
  | "avant-apres"
  | "default";

const ICONS: Record<ArtKind, LucideIcon> = {
  maquillage: Wand2,
  coiffure: Scissors,
  onglerie: Gem,
  beaute: Sparkles,
  pyjamas: Shirt,
  accessoires: Gift,
  "produits-beaute": Sparkles,
  ongles: Gem,
  "avant-apres": Images,
  default: Sparkles,
};

const GRADIENTS: Record<ArtKind, string> = {
  maquillage: "from-blush-200 via-blush-100 to-nude-100",
  coiffure: "from-nude-300 via-nude-200 to-blush-100",
  onglerie: "from-gold-300 via-nude-100 to-blush-100",
  beaute: "from-blush-100 via-nude-100 to-gold-300",
  pyjamas: "from-blush-200 via-nude-100 to-nude-200",
  accessoires: "from-gold-300 via-blush-100 to-nude-100",
  "produits-beaute": "from-nude-200 via-blush-100 to-gold-300",
  ongles: "from-blush-100 via-gold-300 to-nude-100",
  "avant-apres": "from-nude-200 via-nude-100 to-blush-200",
  default: "from-nude-100 via-blush-100 to-gold-300",
};

export function CategoryArt({
  category = "default",
  label,
  className,
}: {
  category?: ArtKind;
  label?: string;
  className?: string;
}) {
  const Icon = ICONS[category] ?? ICONS.default;
  const gradient = GRADIENTS[category] ?? GRADIENTS.default;

  return (
    <div
      className={clsx(
        "relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <div className="absolute inset-0 opacity-30 mix-blend-overlay [background-image:radial-gradient(circle_at_20%_20%,white,transparent_45%)]" />
      <Icon className="h-8 w-8 text-ink-700/70" strokeWidth={1.5} />
      {label && (
        <span className="px-4 text-center font-display text-sm text-ink-700/70">{label}</span>
      )}
    </div>
  );
}
