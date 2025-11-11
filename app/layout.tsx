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
        <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
          <filter id="glitchNoise">
            <feTurbulence
              id="glitch-noise-turbulence"
              type="fractalNoise"
              baseFrequency="0.35 0.6"
              numOctaves={3}
              seed={8}
              result="noise"
            />
            <feDisplacementMap
              id="glitch-noise-displace"
              in="SourceGraphic"
              in2="noise"
              scale={0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
        {children}
      </body>
    </html>
  );
}

