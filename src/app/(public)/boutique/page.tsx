import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/Container";
import { BoutiqueList } from "@/components/boutique/BoutiqueList";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Pyjamas, accessoires beauté et produits beauté — la boutique KN Beauty Studio.",
};

export default function BoutiquePage() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Boutique"
        title="Pyjamas, accessoires & produits beauté"
        description="Prolongez l'expérience KN Beauty Studio à la maison avec notre sélection de produits."
      />
      <div className="mt-10">
        <Suspense fallback={<div className="h-10" />}>
          <BoutiqueList />
        </Suspense>
      </div>
    </Container>
  );
}
