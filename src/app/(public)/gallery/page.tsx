import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/Container";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Galerie beauté",
  description: "Maquillage, coiffure, ongles et transformations avant/après réalisées par KN Beauty Studio.",
};

export default function GalleryPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Inspiration"
        title="Notre galerie beauté"
        description="Un aperçu de nos réalisations en maquillage, coiffure et onglerie."
      />
      <div className="mt-10">
        <GalleryGrid />
      </div>
    </Container>
  );
}
