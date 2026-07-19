import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, SectionHeading } from "@/components/ui/Container";
import { ServicesList } from "@/components/services/ServicesList";

export const metadata: Metadata = {
  title: "Nos services beauté",
  description: "Maquillage, coiffure, onglerie et soins beauté — découvrez toutes les prestations de KN Beauty Studio.",
};

export default function ServicesPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Prestations"
        title="Nos services beauté"
        description="Maquillage, coiffure, onglerie et beauté générale : choisissez votre prestation, au studio ou à domicile."
      />
      <div className="mt-10">
        <Suspense fallback={<div className="h-10" />}>
          <ServicesList />
        </Suspense>
      </div>
    </Container>
  );
}
