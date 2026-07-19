import { Container } from "@/components/ui/Container";
import { ProductDetail } from "@/components/boutique/ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Container className="py-16">
      <ProductDetail id={id} />
    </Container>
  );
}
