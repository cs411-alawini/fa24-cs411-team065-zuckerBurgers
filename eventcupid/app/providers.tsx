"use client";
import { ThemeProvider } from "./theme-provider";
import { RoleProvider } from "./RoleProvider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <RoleProvider>{children}</RoleProvider>
    </ThemeProvider>
  );
}
export default Providers;
