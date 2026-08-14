"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

// Prepackaged lightweight vector Lottie JSONs for zero-dependency instant rendering
export const BUILTIN_ANIMATIONS = {
  empty: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Empty Box",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Sparkle 1",
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 0,
                s: [0],
              },
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 30,
                s: [100],
              },
              { t: 60, s: [0] },
            ],
          },
          r: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 0,
                s: [0],
              },
              { t: 60, s: [90] },
            ],
          },
          p: { a: 0, k: [150, 50, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "sr",
                sy: 1,
                d: 1,
                pt: { a: 0, k: 4 },
                p: { a: 0, k: [0, 0] },
                r: { a: 0, k: 0 },
                or: { a: 0, k: 12 },
                os: { a: 0, k: 0 },
                ir: { a: 0, k: 4 },
                is: { a: 0, k: 0 },
              },
              {
                ty: "fl",
                c: { a: 0, k: [0.42, 0.38, 0.95, 1] },
                o: { a: 0, k: 100 },
              },
            ],
          },
        ],
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "Sparkle 2",
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 15,
                s: [0],
              },
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 45,
                s: [90],
              },
              { t: 60, s: [0] },
            ],
          },
          r: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 0,
                s: [45],
              },
              { t: 60, s: [135] },
            ],
          },
          p: { a: 0, k: [50, 65, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [80, 80, 100] },
        },
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "sr",
                sy: 1,
                d: 1,
                pt: { a: 0, k: 4 },
                p: { a: 0, k: [0, 0] },
                r: { a: 0, k: 0 },
                or: { a: 0, k: 10 },
                os: { a: 0, k: 0 },
                ir: { a: 0, k: 3 },
                is: { a: 0, k: 0 },
              },
              {
                ty: "fl",
                c: { a: 0, k: [0.65, 0.65, 0.7, 1] },
                o: { a: 0, k: 100 },
              },
            ],
          },
        ],
      },
      {
        ddd: 0,
        ind: 3,
        ty: 4,
        nm: "Box Body",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 0,
                s: [100, 120, 0],
              },
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 30,
                s: [100, 114, 0],
              },
              { t: 60, s: [100, 120, 0] },
            ],
          },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "rc",
                d: 1,
                s: { a: 0, k: [80, 56] },
                p: { a: 0, k: [0, 0] },
                r: { a: 0, k: 14 },
              },
              {
                ty: "st",
                c: { a: 0, k: [0.42, 0.38, 0.95, 0.8] },
                o: { a: 0, k: 100 },
                w: { a: 0, k: 2.5 },
              },
              {
                ty: "fl",
                c: { a: 0, k: [0.12, 0.12, 0.14, 0.9] },
                o: { a: 0, k: 100 },
              },
            ],
          },
        ],
      },
      {
        ddd: 0,
        ind: 4,
        ty: 4,
        nm: "Box Lid Floating",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 0,
                s: [0],
              },
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 30,
                s: [-6],
              },
              { t: 60, s: [0] },
            ],
          },
          p: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 0,
                s: [100, 85, 0],
              },
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 30,
                s: [100, 75, 0],
              },
              { t: 60, s: [100, 85, 0] },
            ],
          },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "rc",
                d: 1,
                s: { a: 0, k: [86, 16] },
                p: { a: 0, k: [0, 0] },
                r: { a: 0, k: 8 },
              },
              {
                ty: "st",
                c: { a: 0, k: [0.9, 0.9, 0.93, 0.9] },
                o: { a: 0, k: 100 },
                w: { a: 0, k: 2 },
              },
              {
                ty: "fl",
                c: { a: 0, k: [0.2, 0.2, 0.24, 0.9] },
                o: { a: 0, k: 100 },
              },
            ],
          },
        ],
      },
    ],
  },
  error: {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 200,
    h: 200,
    nm: "Error Pulse",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Outer Glow Pulse",
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 0,
                s: [20],
              },
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 30,
                s: [60],
              },
              { t: 60, s: [20] },
            ],
          },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 0,
                s: [100, 100, 100],
              },
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: 30,
                s: [115, 115, 100],
              },
              { t: 60, s: [100, 100, 100] },
            ],
          },
        },
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "el",
                d: 1,
                p: { a: 0, k: [0, 0] },
                s: { a: 0, k: [90, 90] },
              },
              {
                ty: "fl",
                c: { a: 0, k: [0.95, 0.25, 0.25, 0.3] },
                o: { a: 0, k: 100 },
              },
            ],
          },
        ],
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "Error Badge",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [100, 100, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "el",
                d: 1,
                p: { a: 0, k: [0, 0] },
                s: { a: 0, k: [64, 64] },
              },
              {
                ty: "st",
                c: { a: 0, k: [0.95, 0.3, 0.3, 0.8] },
                o: { a: 0, k: 100 },
                w: { a: 0, k: 2 },
              },
              {
                ty: "fl",
                c: { a: 0, k: [0.18, 0.08, 0.08, 0.95] },
                o: { a: 0, k: 100 },
              },
            ],
          },
        ],
      },
    ],
  },
};

export interface LottiePlayerProps {
  animationData?: object;
  preset?: keyof typeof BUILTIN_ANIMATIONS;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  size?: number | string;
}

/**
 * SSR-safe, lightweight Lottie animation player with built-in dark matte presets
 */
export function LottiePlayer({
  animationData,
  preset = "empty",
  loop = true,
  autoplay = true,
  className = "",
  size = 140,
}: LottiePlayerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = animationData || BUILTIN_ANIMATIONS[preset] || BUILTIN_ANIMATIONS.empty;

  if (!mounted) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="size-12 rounded-full border-2 border-[#e5e5e5]/10 border-t-[#6b62f2] animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <Lottie
        animationData={data}
        loop={loop}
        autoPlay={autoplay}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
