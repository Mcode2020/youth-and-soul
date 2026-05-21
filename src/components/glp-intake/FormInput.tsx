import { useId } from "react";

interface FormInputProps {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function FormInput({ label, required, type = "text", value, onChange, placeholder }: FormInputProps) {
  const id = useId();
  return (
    <div style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>
      <label htmlFor={id} className="text-base font-bold text-primary mb-2 block cursor-pointer">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-6 py-4 rounded-full border border-foreground/40 bg-background text-foreground text-base font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:border-2 transition-all min-h-[52px]"
      />
    </div>
  );
}
