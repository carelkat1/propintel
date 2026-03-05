"use client";

import { useEffect, useRef } from "react";
import { getScoreColor, getScoreLabel } from "@/lib/predictionEngine";

interface LikelinessRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const SIZES = {
  sm: { dim: 52, stroke: 4, r: 20, textSize: "text-[11px]" },
  md: { dim: 72, stroke: 5, r: 29, textSize: "text-sm" },
  lg: { dim: 100, stroke: 6, r: 40, textSize: "text-base" },
};

export default function LikelinessRing({
  score,
  size = "md",
  showLabel = false,
}: LikelinessRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const { dim, stroke, r, textSize } = SIZES[size];
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const colors = getScoreColor(score);
  const label = getScoreLabel(score);

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = String(circumference);
      circleRef.current.style.transition = "stroke-dashoffset 0s";
      // Force reflow then animate
      void circleRef.current.getBoundingClientRect();
      circleRef.current.style.transition = "stroke-dashoffset 1.1s cubic-bezier(0.4, 0, 0.2, 1)";
      circleRef.current.style.strokeDashoffset = String(offset);
    }
  }, [score, offset, circumference]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dim}
          height={dim}
          viewBox={`0 0 ${dim} ${dim}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            ref={circleRef}
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke={colors.ring}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
          />
        </svg>
        {/* Score text */}
        <span
          className={`absolute font-semibold tabular-nums ${textSize} ${colors.text}`}
          style={{ letterSpacing: "-0.02em" }}
        >
          {score}
          <span className={`${size === "sm" ? "text-[9px]" : "text-[10px]"} opacity-70`}>%</span>
        </span>
      </div>

      {showLabel && (
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${colors.badge} ${colors.text}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
