import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

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
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          storageKey="devboard-theme"
        >
          <main>
            {children}
            <Toaster position="top-center" richColors />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
