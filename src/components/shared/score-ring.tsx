'use client';

import { useEffect, useState } from 'react';
import { scoreColor, scoreLabel } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizes = {
  sm: { width: 56, stroke: 5, fontSize: 16, labelSize: 8 },
  md: { width: 80, stroke: 6, fontSize: 22, labelSize: 10 },
  lg: { width: 120, stroke: 8, fontSize: 32, labelSize: 12 },
};

export default function ScoreRing({ score, size = 'md', showLabel = true }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const { width, stroke, fontSize, labelSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = scoreColor(score);
  const label = scoreLabel(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center" style={{ width, height: width + (showLabel ? labelSize + 8 : 0) }}>
      <svg width={width} height={width} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="#E5E5EA"
          strokeWidth={stroke}
        />
        {/* Score ring */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke + 1}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </svg>
      {/* Center score */}
      <div
        className="absolute flex items-center justify-center"
        style={{ top: 0, left: 0, width, height: width }}
      >
        <span className="font-mono font-bold text-text-primary" style={{ fontSize }}>
          {score}
        </span>
      </div>
      {/* Label */}
      {showLabel && (
        <span
          className="font-semibold mt-1 uppercase tracking-wider"
          style={{ fontSize: labelSize, color }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
