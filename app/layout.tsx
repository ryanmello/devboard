import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Sidebar from "@/components/Sidebar";
import SidebarCN from "@/components/SidebarCN";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Devboard",
  description: "The Better Portfolio for Software Engineers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            forcedTheme="dark"
            storageKey="devboard-theme"
          >
            <main className="flex items-start justify-between">
              <Sidebar />
              <div className="w-full h-full">
                {children}
              </div>
            </main>
            {/* <SidebarProvider>
              <SidebarCN />
              <SidebarInset>{children}</SidebarInset>
            </SidebarProvider> */}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
