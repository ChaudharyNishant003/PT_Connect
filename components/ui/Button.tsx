import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark disabled:bg-gray-300",
  secondary: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-300",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", className = "", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
});

export default Button;
