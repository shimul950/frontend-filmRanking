import NextTopLoader from "nextjs-toploader";
import { Geist_Mono, Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import QueryProviders from "../providers/QueryProviders";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden flex flex-col selection:bg-red-500/20 selection:text-red-400">
        <NextTopLoader
          color="#e50914"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 12px #e50914, 0 0 4px #f43f5e"
          zIndex={99999}
        />
        <TooltipProvider>
          <ThemeProvider>
            <QueryProviders>
              {children}
              <Toaster richColors position="top-right" />
            </QueryProviders>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
