import type { SellCriterion } from "@/types";
import {
  UserMinus,
  Clock,
  TrendingUp,
  HeartCrack,
  ScrollText,
  Hammer,
  BadgeDollarSign,
  AlertTriangle,
  Heart,
  ArrowDownToLine,
  ArrowUpToLine,
  Home,
} from "lucide-react";

const CRITERION_META: Record<
  SellCriterion,
  { icon: React.ReactNode; color: string }
> = {
  "Empty Nester": {
    icon: <UserMinus size={11} />,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  "7+ Years Owned": {
    icon: <Clock size={11} />,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "10+ Years Owned": {
    icon: <Clock size={11} />,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  "Retirement Age": {
    icon: <Home size={11} />,
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  "High Area Sales Velocity": {
    icon: <TrendingUp size={11} />,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "Divorce Record": {
    icon: <HeartCrack size={11} />,
    color: "bg-red-50 text-red-700 border-red-200",
  },
  "Estate / Probate": {
    icon: <ScrollText size={11} />,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "Recent Renovation Permits": {
    icon: <Hammer size={11} />,
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  "Under-valued Property": {
    icon: <BadgeDollarSign size={11} />,
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  "Financial Stress Indicators": {
    icon: <AlertTriangle size={11} />,
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  "Life Event – Marriage": {
    icon: <Heart size={11} />,
    color: "bg-pink-50 text-pink-700 border-pink-200",
  },
  "Downsizing Candidate": {
    icon: <ArrowDownToLine size={11} />,
    color: "bg-violet-50 text-violet-700 border-violet-200",
  },
  "Upsizing Candidate": {
    icon: <ArrowUpToLine size={11} />,
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  "Absentee Owner": {
    icon: <UserMinus size={11} />,
    color: "bg-slate-50 text-slate-700 border-slate-200",
  },
};

interface CriteriaTagProps {
  criterion: SellCriterion;
}

export default function CriteriaTag({ criterion }: CriteriaTagProps) {
  const meta = CRITERION_META[criterion] ?? {
    icon: null,
    color: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${meta.color}`}
    >
      {meta.icon}
      {criterion}
    </span>
  );
}
