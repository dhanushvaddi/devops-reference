interface Props {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: Props) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-muted">{label || `${current} / ${total} reviewed`}</span>
        <span className="text-xs font-bold text-success">{pct}%</span>
      </div>
      <div className="bg-border rounded-full h-2">
        <div
          className="bg-success h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
