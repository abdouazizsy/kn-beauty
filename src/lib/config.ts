export const BRAND = {
  name: "KN Beauty Studio",
  tagline: "L'élégance, révélée.",
  description:
    "Institut de beauté moderne à Tivaouane : maquillage professionnel, coiffure, onglerie et boutique beauté. Réservez votre expérience premium en quelques clics.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "221771830493",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com",
  address: "Tivaouane, quartier Darou Salam, Sénégal",
  studioName: "Studio KN Beauty",
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${BRAND.whatsappNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Formats the WhatsApp number for display, e.g. "221771830493" -> "+221 77 183 04 93". */
export function whatsappNumberDisplay() {
  const digits = BRAND.whatsappNumber;
  const country = digits.slice(0, 3);
  const national = digits.slice(3);
  if (national.length !== 9) return `+${country} ${national}`;
  const groups = [national.slice(0, 2), national.slice(2, 5), national.slice(5, 7), national.slice(7, 9)];
  return `+${country} ${groups.join(" ")}`;
}
