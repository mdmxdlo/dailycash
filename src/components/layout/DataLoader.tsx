"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DataLoader({ children }: { children: React.ReactNode }) {
  const fetchData = useStore((state) => state.fetchData);
  const isInitialized = useStore((state) => state.isInitialized);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      if (!isInitialized) {
        await fetchData(session.user.id);
      }
      setLoading(false);
    };

    init();
  }, [fetchData, isInitialized, router, supabase.auth]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
