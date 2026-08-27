import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

// Closest free match to the TicketBro wordmark: geometric, tall x-height.
const brandFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TicketBro Support",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased ${brandFont.variable}`}>
      <body className="min-h-full">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
