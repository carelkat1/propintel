interface BadgeCustomProps {
  children: React.ReactNode;
  color: string;
  border?: boolean;
}

export default function BadgeCustom({ children, color, border }: BadgeCustomProps) {
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded font-semibold font-mono whitespace-nowrap"
      style={{
        background: `${color}14`,
        color,
        border: border ? `1px solid ${color}30` : "none",
      }}
    >
      {children}
    </span>
  );
}
