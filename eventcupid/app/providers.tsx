"use client";
import { ThemeProvider } from "./theme-provider";
import { RoleProvider } from "./RoleProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <RoleProvider>{children}</RoleProvider>
    </ThemeProvider>
    </QueryClientProvider>
  );
}
export default Providers;
