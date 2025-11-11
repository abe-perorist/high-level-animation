"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HomePage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinWrapperRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!sectionRef.current || !pinWrapperRef.current || !titleRef.current) {
        return;
      }

      gsap.set(titleRef.current, { transformOrigin: "center center" });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=100%",
            scrub: true,
            pin: pinWrapperRef.current,
            anticipatePin: 1,
          },
        })
        .fromTo(
          titleRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1.5, opacity: 1, ease: "power2.out" },
        );

      gsap.to(".parallax-card--left", {
        xPercent: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top+=100% top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      gsap.to(".parallax-card--middle", {
        xPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top+=100% top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      gsap.to(".parallax-card--right", {
        xPercent: 40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top+=100% top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col overflow-x-hidden">
      <section className="flex h-screen flex-col items-center justify-center bg-background-dark bg-grid px-6 text-center">
        <p className="text-slate-400">Scroll-driven prototype</p>
        <h1 className="mt-4 max-w-4xl text-balance text-5xl font-semibold tracking-tight text-white md:text-7xl">
          Elevate your narrative with motion-crafted storytelling.
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg text-slate-300 md:text-xl">
          This sandbox explores immersive interactions inspired by award-winning portfolios. Scroll to uncover how
          sticking, scaling, and parallax bring the experience to life.
        </p>
      </section>

      <section
        ref={sectionRef}
        className="relative flex flex-col justify-between bg-background-light py-32 text-slate-900"
        style={{ minHeight: "200vh" }}
      >
        <div
          ref={pinWrapperRef}
          className="pointer-events-none flex h-screen items-center justify-center px-6"
        >
          <h2
            ref={titleRef}
            className="text-balance text-4xl font-bold leading-tight text-slate-900 md:text-7xl"
          >
            Interactive Web Demo
          </h2>
        </div>

        <div className="flex h-screen items-center justify-center gap-6 px-6 md:gap-10 md:px-16">
          <div className="parallax-card parallax-card--left w-full max-w-sm rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Item 1</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-900">Dive into Detail</h3>
            <p className="mt-3 text-slate-600">
              Showcase key highlights as the user advances the storyline, keeping focus while reinforcing hierarchy.
            </p>
          </div>
          <div className="parallax-card parallax-card--middle w-full max-w-sm rounded-3xl border border-slate-200/60 bg-white p-8 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Item 2</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-900">Stay Center Stage</h3>
            <p className="mt-3 text-slate-600">
              Anchor the experience with a hero module that remains in view, reinforcing core messaging.
            </p>
          </div>
          <div className="parallax-card parallax-card--right w-full max-w-sm rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-xl backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Item 3</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-900">Motion with Purpose</h3>
            <p className="mt-3 text-slate-600">
              Direct attention with lateral motion to suggest spatial depth and contextual transitions.
            </p>
          </div>
        </div>
      </section>

      <footer className="flex h-[50vh] flex-col items-center justify-center bg-background-dark bg-grid px-6 text-center text-slate-300">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Footer</p>
        <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
          Ready to deploy on Vercel when you are.
        </h2>
        <p className="mt-3 max-w-xl text-pretty text-slate-400">
          Clone, install dependencies, and run <code className="rounded bg-slate-800 px-2 py-1 text-sm text-slate-200">pnpm dev</code> to start exploring.
        </p>
      </footer>
    </main>
  );
}

