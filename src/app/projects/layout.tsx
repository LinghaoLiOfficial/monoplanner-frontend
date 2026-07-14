import type { ReactNode } from "react";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/layout/AppShell";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth redirectAdmin>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
