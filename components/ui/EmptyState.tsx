import { ReactNode } from "react";

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-center">
      <p className="text-base font-semibold text-gray-800">{title}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
      {action}
    </div>
  );
}
