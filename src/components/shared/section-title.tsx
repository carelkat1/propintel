interface SectionTitleProps {
  children: React.ReactNode;
  sub?: string;
  right?: React.ReactNode;
}

export default function SectionTitle({ children, sub, right }: SectionTitleProps) {
  return (
    <div className="mb-5 flex justify-between items-start flex-wrap gap-2">
      <div>
        <h2 className="font-heading text-2xl font-bold text-text-primary tracking-tight">
          {children}
        </h2>
        {sub && (
          <p className="text-text-muted text-[13px] mt-1 max-w-[650px]">{sub}</p>
        )}
      </div>
      {right}
    </div>
  );
}
