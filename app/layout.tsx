"use client";

import "@/styles/globals.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { AppProvider } from "@/context/AppContext";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();


  const publicPages = ["/", "/plans", "/login", "/register"];
  const hideLayout = publicPages.includes(pathname);

  return (
    <html lang="es">
      <body>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            {hideLayout ? (
              <main>{children}</main>
            ) : (
              <div style={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar />
                <div style={{ flex: 1 }}>
                  <Topbar />
                  <main>{children}</main>
                </div>
              </div>
            )}
          </AppProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
