"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { DataLoader } from "@/components/layout/DataLoader";
import { OnboardingGuide } from "@/components/layout/OnboardingGuide";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Landing page at "/" — skip the dashboard shell entirely
  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <DataLoader>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <OnboardingGuide />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DataLoader>
  );
}
