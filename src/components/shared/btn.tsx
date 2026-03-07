interface BtnProps {
  children: React.ReactNode;
  color?: string;
  variant?: "filled" | "ghost";
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function Btn({
  children,
  color = "#10b981",
  variant = "filled",
  onClick,
  disabled,
  className,
  style,
}: BtnProps) {
  const bg = variant === "filled" ? (disabled ? "#1e293b" : color) : `${color}15`;
  const fg = variant === "filled" ? "#fff" : color;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        padding: "8px 16px",
        borderRadius: 8,
        background: bg,
        border: variant === "filled" ? "none" : `1px solid ${color}35`,
        color: fg,
        fontSize: 12,
        fontWeight: 700,
        cursor: disabled ? "default" : "pointer",
        fontFamily: "inherit",
        transition: "all 0.15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
