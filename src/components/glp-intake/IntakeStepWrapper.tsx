import { ReactNode } from "react";

interface IntakeStepWrapperProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  greeting?: string;
}

export function IntakeStepWrapper({ step, totalSteps, title, subtitle, children, greeting }: IntakeStepWrapperProps) {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            Part {step + 1} of {totalSteps}
          </span>
          <span className="text-xs text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Estimated time remaining */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <span className="text-xs text-muted-foreground">Estimated time: ~{Math.max(1, Math.ceil((totalSteps - step - 1) * 0.7))} min remaining</span>
        </div>
      </div>

      {/* Greeting */}
      {greeting && (
        <p className="text-sm text-primary font-medium">{greeting}</p>
      )}

      {/* Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight" style={{ fontFamily: "'Nunito', 'SF Pro Rounded', system-ui, sans-serif" }}>{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1.5">{subtitle}</p>}
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
