import { cn } from "@/lib/utils";

export type Option = {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
};

type OptionSelectInputProps = {
  id: string;
  name: string;
  value: string | number | null;
  options: Option[];
  columns: number;
  onChange: (next: string | number) => void;
};

export default function OptionSelectInput({
  id,
  name,
  value,
  options,
  onChange,
  columns,
}: OptionSelectInputProps) {
  return (
    <div
      id={id}
      role="radiogroup"
      aria-label={name}
      className={cn(
        "grid gap-3",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-4",
      )}
    >
      {options.map((option) => {
        const checked = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border transition-colors",
              checked
                ? "border-primary-purple bg-white text-primary-purple"
                : "border-gray-200 bg-gray-purple text-gray-400",
              option.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            )}
          >
            <div className="flex flex-col gap-1 py-2">
              <span className="text-body-emphasis">{option.label}</span>
              {option.description ? (
                <span className="text-caption !font-[600]">{option.description}</span>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
