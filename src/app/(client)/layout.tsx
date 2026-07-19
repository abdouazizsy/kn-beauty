import { Navbar } from "@/components/layout/Navbar";
import { ClientNav } from "@/components/client/ClientNav";
import { RequireAuth } from "@/components/shared/RequireAuth";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth role="cliente">
      <Navbar />
      <ClientNav />
      <main className="flex-1 bg-nude-50/40">{children}</main>
      <WhatsAppButton message="Bonjour, j'ai une question concernant mon compte KN Beauty Studio." />
    </RequireAuth>
  );
}
