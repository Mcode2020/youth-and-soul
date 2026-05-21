import { Check } from "lucide-react";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}

export function OptionButton({ label, selected, onClick, multi = false }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group w-full text-left px-6 py-5 rounded-full border transition-all duration-200 flex items-center gap-4 ${
        selected
          ? "border-primary border-2 bg-primary/[0.04]"
          : "border-foreground/40 hover:border-foreground bg-background"
      }`}
      style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}
    >
      <span className="flex-1 text-base md:text-[17px] font-semibold text-foreground leading-snug">
        {label}
      </span>
      {multi && (
        <div
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
            selected ? "border-primary bg-primary" : "border-muted-foreground/30 group-hover:border-foreground/40"
          }`}
        >
          {selected && <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />}
        </div>
      )}
    </button>
  );
}
