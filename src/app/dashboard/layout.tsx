import { auth, signOut } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import { Settings, LogOut } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <div className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-2 bg-[#f1f5f9] rounded-lg px-4 py-2">
              <span className="text-[#94a3b8] text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none outline-none text-sm text-[#1e293b] w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4">
            <button className="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-2xl relative hover:bg-[#f1f5f9]">
              🔔
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-2xl hover:bg-[#f1f5f9]">
              ⚙️
            </button>
            <form action={async () => {
              "use server";
              await signOut({ redirectTo: "/auth/login" });
            }}>
              <button type="submit" className="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer flex items-center justify-center text-2xl hover:bg-[#f1f5f9]">
                🚪
              </button>
            </form>
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-[#f8fafc] border border-[#e2e8f0]">
              <div className="w-8 h-8 rounded-full bg-[#e2e8f0] flex items-center justify-center text-sm font-medium text-[#64748b]">
                {(user as any)?.fullName?.charAt(0) || "U"}
              </div>
              <span className="text-sm font-medium text-[#1e293b]">{(user as any)?.fullName || "User"}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
