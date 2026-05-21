interface PaymentLogosBarProps {
  size?: "sm" | "lg";
}

export function PaymentLogosBar({ size = "sm" }: PaymentLogosBarProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <img src="/images/legitscript-certified.webp" alt="LegitScript Certified" className="h-20 md:h-24 w-auto object-contain" loading="lazy" />
      <img src="/images/payment-cards-footer.png" alt="We accept Visa, MasterCard, Discover, and American Express" className={`${size === "lg" ? "h-6 md:h-7" : "h-5 md:h-6"} w-auto object-contain`} loading="lazy" />
    </div>
  );
}
