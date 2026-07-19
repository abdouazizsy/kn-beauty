import { Container } from "@/components/ui/Container";
import { ServiceDetail } from "@/components/services/ServiceDetail";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Container className="py-16">
      <ServiceDetail id={id} />
    </Container>
  );
}
