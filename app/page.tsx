"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HomePage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinWrapperRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const cubeRef = useRef<HTMLDivElement | null>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement | null>(null);

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
      gsap.set(cubeRef.current, { transformOrigin: "center center", willChange: "transform" });

      const faces = gsap.utils.toArray<HTMLElement>(".cube-face");
      faces.forEach((face) => {
        face.style.willChange = "transform, opacity";
      });

      const vectors = faces.map(() => ({
        x: gsap.utils.random(-160, 160),
        y: gsap.utils.random(-160, 160),
        z: gsap.utils.random(-220, 220),
        rotationX: gsap.utils.random(-40, 40),
        rotationY: gsap.utils.random(-40, 40),
      }));

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
          { scale: 1.45, opacity: 1, ease: "power3.out" },
          0,
        )
        .to(
          cubeRef.current,
          { rotateY: -90, duration: 1 },
          0,
        )
        .to(
          cubeRef.current,
          { rotateY: -180, duration: 1 },
          ">",
        )
        .addLabel("explode")
        .to(
          faces,
          {
            duration: 0.65,
            opacity: 0,
            x: (_, i) => vectors[i].x,
            y: (_, i) => vectors[i].y,
            z: (_, i) => vectors[i].z,
            rotationX: (_, i) => vectors[i].rotationX,
            rotationY: (_, i) => vectors[i].rotationY,
            stagger: { each: 0.05, from: "random" },
            ease: "power3.out",
          },
          "explode",
        )
        .addLabel("reassemble", "explode+=0.7")
        .to(
          faces,
          {
            duration: 0.65,
            opacity: 1,
            x: 0,
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            stagger: { each: 0.04, from: "center" },
            ease: "power3.inOut",
          },
          "reassemble",
        )
        .to(
          cubeRef.current,
          { rotateX: -90, rotateY: -180, duration: 1, ease: "power2.inOut" },
          "reassemble+=0.7",
        );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    turbulenceRef.current = document.getElementById(
      "glitch-noise-turbulence",
    ) as SVGFETurbulenceElement | null;
    displacementRef.current = document.getElementById(
      "glitch-noise-displace",
    ) as SVGFEDisplacementMapElement | null;

    const faces = Array.from(document.querySelectorAll<HTMLElement>(".cube-face"));
    const turbulence = turbulenceRef.current;
    const displacement = displacementRef.current;

    if (!turbulence || !displacement || faces.length === 0) {
      return;
    }

    let hoverFace: HTMLElement | null = null;
    let pointer = { x: 0, y: 0 };
    let rafId: number | null = null;

    const resetFilter = () => {
      turbulence.setAttribute("baseFrequency", "0.35 0.6");
      displacement.setAttribute("scale", "0");
    };

    const updateFilter = () => {
      if (!hoverFace) {
        rafId = null;
        return;
      }

      const rect = hoverFace.getBoundingClientRect();
      const relX = (pointer.x - rect.left) / rect.width;
      const relY = (pointer.y - rect.top) / rect.height;

      const freqX = (0.35 + relX * 0.35).toFixed(3);
      const freqY = (0.6 + relY * 0.4).toFixed(3);
      const scale = Math.max(10, Math.min(55, 20 + relX * 30 + relY * 30)).toFixed(2);

      turbulence.setAttribute("baseFrequency", `${freqX} ${freqY}`);
      displacement.setAttribute("scale", scale);

      rafId = window.requestAnimationFrame(updateFilter);
    };

    const handlePointerEnter = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement;
      hoverFace = target;
      pointer = { x: event.clientX, y: event.clientY };
      target.style.filter = "url(#glitchNoise)";
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateFilter);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
    };

    const handlePointerLeave = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement;
      target.style.filter = "none";
      hoverFace = null;
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      resetFilter();
    };

    faces.forEach((face) => {
      face.addEventListener("pointerenter", handlePointerEnter);
      face.addEventListener("pointermove", handlePointerMove);
      face.addEventListener("pointerleave", handlePointerLeave);
    });

    return () => {
      faces.forEach((face) => {
        face.removeEventListener("pointerenter", handlePointerEnter);
        face.removeEventListener("pointermove", handlePointerMove);
        face.removeEventListener("pointerleave", handlePointerLeave);
        face.style.filter = "none";
      });

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }

      resetFilter();
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
      className={`cube-face absolute flex h-full w-full items-center justify-center rounded-3xl text-center text-xl font-semibold text-white shadow-2xl transition-[filter] duration-200 ${bgClass}`}
      style={{
        transform,
        backfaceVisibility: "hidden",
        willChange: "transform, opacity",
      }}
      data-face={label}
    >
      {label}
    </div>
  );
}

