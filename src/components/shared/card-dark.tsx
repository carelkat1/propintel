import { cn } from "@/lib/utils";

interface CardDarkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function CardDark({ children, className, onClick, style }: CardDarkProps) {
  return (
    <div
      className={cn("bg-bg-card border border-border rounded-xl", className)}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
