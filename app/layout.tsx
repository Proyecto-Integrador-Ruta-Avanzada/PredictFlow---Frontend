"use client";

import "@/styles/globals.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { AppProvider } from "@/context/AppContext";
import { TeamsProvider } from "@/context/TeamsProdiver"; // <-- aquí

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const authPages = ["/login", "/register"];
  const hideLayout = authPages.includes(pathname);

  return (
    <html lang="es">
      <body>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <TeamsProvider>
              {hideLayout ? (
                <main>{children}</main>
              ) : (
                <div style={{ display: "flex", minHeight: "100vh" }}>
                  <div style={{ flex: 1 }}>
                    <main>{children}</main>
                  </div>
                </div>
              )}
            </TeamsProvider>
          </AppProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
