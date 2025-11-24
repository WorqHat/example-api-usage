"use client";

import { useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";

const stars = [
  // [cx, cy, dim, blur]
  [4, 4, true, true],
  [4, 44, true],
  [36, 22],
  [50, 146, true, true],
  [64, 43, true, true],
  [76, 30, true],
  [101, 116],
  [140, 36, true],
  [149, 134],
  [162, 74, true],
  [171, 96, true, true],
  [210, 56, true, true],
  [235, 90],
  [275, 82, true, true],
  [306, 6],
  [307, 64, true, true],
  [380, 68, true],
  [380, 108, true, true],
  [391, 148, true, true],
  [405, 18, true],
  [412, 86, true, true],
  [426, 210, true, true],
  [427, 56, true, true],
  [538, 138],
  [563, 88, true, true],
  [611, 154, true, true],
  [637, 150],
  [651, 146, true],
  [682, 70, true, true],
  [683, 128],
  [781, 82, true, true],
  [785, 158, true],
  [832, 146, true, true],
  [852, 89],
] as const;

const constellations = [
  [
    [247, 103],
    [261, 86],
    [307, 104],
    [357, 36],
  ],
  [
    [586, 120],
    [516, 100],
    [491, 62],
    [440, 107],
    [477, 180],
    [516, 100],
  ],
  [
    [733, 100],
    [803, 120],
    [879, 113],
    [823, 164],
    [803, 120],
  ],
] as const;

function Star({
  blurId,
  point: [cx, cy, dim, blur],
}: {
  blurId: string;
  point: readonly [number, number, boolean?, boolean?];
}) {
  const delay = Math.random() * 2;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 4, delay }}
    >
      <motion.circle
        cx={cx}
        cy={cy}
        r={1}
        style={{
          transformOrigin: `${cx / 16}rem ${cy / 16}rem`,
        }}
        filter={blur ? `url(#${blurId})` : undefined}
        animate={{
          opacity: dim ? [0.2, 0.5] : [1, 0.6],
          scale: dim ? [1, 1.2] : [1.2, 1],
        }}
        transition={{
          delay,
          duration: Math.random() * 2 + 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </motion.g>
  );
}

function Constellation({ points }: { points: readonly (readonly [number, number])[] }) {
  const uniquePoints = points.filter(
    (point, pointIndex) =>
      points.findIndex((p) => String(p) === String(point)) === pointIndex
  );
  const isFilled = uniquePoints.length !== points.length;
  const pathData = `M ${points.map((p) => p.join(",")).join(" L")}`;

  return (
    <>
      <motion.path
        stroke="white"
        strokeOpacity="0.1"
        strokeWidth="2"
        fill="transparent"
        d={pathData}
        style={{ filter: "blur(2px)" }}
        animate={{
          strokeOpacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: Math.random() * 10 + 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.path
        stroke="white"
        strokeOpacity="0.2"
        strokeDasharray={1}
        fill={isFilled ? "rgba(255, 255, 255, 0.02)" : "transparent"}
        d={pathData}
        initial={{ strokeDashoffset: 1, pathLength: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 5, delay: Math.random() * 3 + 2 }}
      />
      {uniquePoints.map((point, pointIndex) => (
        <Star key={pointIndex} point={point} blurId="" />
      ))}
    </>
  );
}

export function StarField() {
  const blurId = useId();

  return (
    <svg
      viewBox="0 0 881 211"
      fill="white"
      aria-hidden="true"
      className="pointer-events-none absolute -right-44 top-14 w-[55.0625rem] origin-top-right rotate-[30deg] overflow-visible opacity-70"
    >
      <defs>
        <filter id={blurId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation=".5" />
        </filter>
      </defs>
      {constellations.map((points, constellationIndex) => (
        <Constellation key={constellationIndex} points={points} />
      ))}
      {stars.map((point, pointIndex) => (
        <Star key={pointIndex} point={point} blurId={blurId} />
      ))}
    </svg>
  );
}

