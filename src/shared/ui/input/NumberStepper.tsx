import { cn } from "@/lib/utils";

type NumberStepperProps = {
  label?: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step?: number;
  onChange: (next: number) => void;
  className?: string;
};

export default function NumberStepper({
  label,
  value,
  unit,
  min,
  max,
  step = 1,
  onChange,
  className,
}: NumberStepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));
  const canDec = value > min;
  const canInc = value < max;

  return (
    <div className={cn("flex flex-col gap-2 rounded-lg bg-white", className)}>
      {label ? <div className="text-caption !font-[600] text-gray-600">{label}</div> : null}
      <div className="flex items-center gap-4 text-body-1">
        <button
          type="button"
          disabled={!canDec}
          onClick={() => onChange(clamp(value - step))}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
            canDec ? "border-gray-300 text-gray-700" : "border-gray-200 text-gray-300",
          )}
          aria-label={`${label} 감소`}
        >
          -
        </button>
        <span className="min-w-6 text-center !font-[500] text-gray-900">
          {value}
          {unit}
        </span>
        <button
          type="button"
          disabled={!canInc}
          onClick={() => onChange(clamp(value + step))}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
            canInc ? "border-gray-300 text-gray-700" : "border-gray-200 text-gray-300",
          )}
          aria-label={`${label} 증가`}
        >
          +
        </button>
      </div>
    </div>
  );
}
