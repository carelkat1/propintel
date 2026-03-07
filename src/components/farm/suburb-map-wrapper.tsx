"use client";

import dynamic from "next/dynamic";
import { Suburb } from "@/lib/types";

const SuburbMap = dynamic(() => import("./suburb-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-bg-card rounded-xl border border-border flex items-center justify-center">
      <span className="text-text-muted text-sm font-mono">Loading map...</span>
    </div>
  ),
});

interface SuburbMapWrapperProps {
  suburbs: Suburb[];
  farmed: string[];
  onToggle: (name: string) => void;
  onDrill: (name: string) => void;
}

export default function SuburbMapWrapper(props: SuburbMapWrapperProps) {
  return <SuburbMap {...props} />;
}
