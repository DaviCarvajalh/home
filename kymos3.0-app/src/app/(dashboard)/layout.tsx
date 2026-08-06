import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import NavBar from "@/components/layout/NavBar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const user = session!;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1535]">
      <NavBar userName={user.name} userRole={user.role} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
