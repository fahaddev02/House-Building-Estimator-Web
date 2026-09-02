import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SettingsProvider } from "@/lib/context/SettingsContext";
import { ProjectsProvider } from "@/lib/context/ProjectsContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Paint Calculator & Estimator — Wall, Ceiling & Painting Cost Estimation",
  description:
    "Free online painting calculators for homeowners, painters and contractors. Calculate wall area, ceiling area, paint quantities, and project costs with confidence.",
  keywords: [
    "paint calculator",
    "wall area calculator",
    "ceiling calculator",
    "painting cost estimator",
    "how much paint do I need",
    "room paint calculator",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <SettingsProvider>
          <ProjectsProvider>
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              {children}
            </main>
            <Footer />
          </ProjectsProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
