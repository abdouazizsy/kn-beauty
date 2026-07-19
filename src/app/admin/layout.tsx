import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { RequireAuth } from "@/components/shared/RequireAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth role="admin">
      <div className="flex min-h-screen flex-col bg-nude-50 lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </RequireAuth>
  );
}
