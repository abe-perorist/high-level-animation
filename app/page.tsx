"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HomePage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinWrapperRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cubeRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (
        !sectionRef.current ||
        !pinWrapperRef.current ||
        !titleRef.current ||
        !cubeRef.current
      ) {
        return;
      }

      gsap.set(titleRef.current, { transformOrigin: "center center" });
      gsap.set(cubeRef.current, { transformOrigin: "center center" });

      const cubeTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          scrub: true,
          pin: pinWrapperRef.current,
          anticipatePin: 1,
        },
        defaults: { ease: "none" },
      });

      cubeTimeline
        .fromTo(
          titleRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1.5, opacity: 1, ease: "power2.out" },
          0,
        )
        .to(
          cubeRef.current,
          { rotateY: -90 },
          0,
        )
        .to(
          cubeRef.current,
          { rotateY: -180 },
          1,
        )
        .to(
          cubeRef.current,
          { rotateX: -90, rotateY: -180 },
          2,
        );
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
          className="flex h-screen flex-col items-center justify-center gap-12 px-6 text-center"
        >
          <h2
            ref={titleRef}
            className="max-w-3xl text-balance text-4xl font-bold leading-tight text-slate-900 md:text-6xl"
          >
            Scroll to explore the dimensional story.
          </h2>
          <div
            className="relative flex items-center justify-center"
            style={{ perspective: "1200px" }}
          >
            <div
              ref={cubeRef}
              className="relative"
              style={{
                width: "20rem",
                height: "20rem",
                transformStyle: "preserve-3d",
              }}
            >
              <CubeFace label="Front Content" bgClass="bg-sky-500" transform="rotateY(0deg) translateZ(10rem)" />
              <CubeFace label="Right Content" bgClass="bg-indigo-500" transform="rotateY(90deg) translateZ(10rem)" />
              <CubeFace label="Back Content" bgClass="bg-emerald-500" transform="rotateY(180deg) translateZ(10rem)" />
              <CubeFace label="Left Content" bgClass="bg-rose-500" transform="rotateY(-90deg) translateZ(10rem)" />
              <CubeFace label="Top Content" bgClass="bg-amber-500" transform="rotateX(90deg) translateZ(10rem)" />
              <CubeFace label="Bottom Content" bgClass="bg-slate-700" transform="rotateX(-90deg) translateZ(10rem)" />
            </div>
          </div>
          <p className="max-w-xl text-pretty text-slate-600">
            Each face represents a new narrative beat. Advance the scroll to rotate the cube and surface additional
            content moments across three axes.
          </p>
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

type CubeFaceProps = {
  label: string;
  bgClass: string;
  transform: string;
};

function CubeFace({ label, bgClass, transform }: CubeFaceProps) {
  return (
    <div
      className={`absolute flex h-full w-full items-center justify-center rounded-3xl text-center text-xl font-semibold text-white shadow-2xl ${bgClass}`}
      style={{ transform }}
    >
      {label}
    </div>
  );
}

