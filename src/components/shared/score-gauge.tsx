"use client";

import { scoreColor, scoreLabel } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export default function ScoreGauge({ score, size = 76 }: ScoreGaugeProps) {
  const r = (size - 12) / 2;
  const circ = Math.PI * r;
  const fill = (score / 100) * circ;
  const c = scoreColor(score);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size / 2 + 16 }}>
      <svg width={size} height={size / 2 + 16} viewBox={`0 0 ${size} ${size / 2 + 16}`}>
        <path
          d={`M 6 ${size / 2 + 6} A ${r} ${r} 0 0 1 ${size - 6} ${size / 2 + 6}`}
          fill="none"
          stroke="#1a2332"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d={`M 6 ${size / 2 + 6} A ${r} ${r} 0 0 1 ${size - 6} ${size / 2 + 6}`}
          fill="none"
          stroke={c}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          style={{ filter: `drop-shadow(0 0 6px ${c}50)` }}
        />
      </svg>
      <div className="absolute bottom-0.5 left-0 right-0 text-center">
        <div
          className="font-mono font-extrabold leading-none"
          style={{ fontSize: size * 0.24, color: c }}
        >
          {score}
        </div>
        <div className="text-[7px] text-text-muted font-mono tracking-widest mt-0.5">
          {scoreLabel(score)}
        </div>
      </div>
    </div>
  );
}
