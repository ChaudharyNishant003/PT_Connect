import { ButtonHTMLAttributes } from "react";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export default function Chip({ active = false, className = "", ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`min-h-[40px] rounded-full border px-4 text-sm font-medium transition-colors ${
        active
          ? "border-brand bg-brand text-white"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      } ${className}`}
      {...props}
    />
  );
}
