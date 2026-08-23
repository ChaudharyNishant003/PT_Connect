import { InputHTMLAttributes, forwardRef } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, id, className = "", ...props },
  ref,
) {
  const inputId = id ?? `field-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={`min-h-[44px] rounded-lg border border-gray-300 px-3 text-base focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 ${className}`}
        {...props}
      />
    </div>
  );
});

export default TextField;
