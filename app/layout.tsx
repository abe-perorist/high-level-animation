import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "High-Level Animation Demo",
  description:
    "A scroll-driven interactive demo inspired by DP Studio, built with Next.js, Tailwind CSS, and GSAP ScrollTrigger.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja">
      <body className="bg-background-dark text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

