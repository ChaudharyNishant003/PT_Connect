import LocaleToggle from "@/components/i18n/LocaleToggle";

export default function ParentHeader({
  studentName,
  centerName,
  teacherName,
}: {
  studentName: string;
  centerName: string;
  teacherName: string;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-900">{studentName}</h1>
          <p className="text-xs text-gray-500">
            {centerName} · {teacherName}
          </p>
        </div>
        <LocaleToggle />
      </div>
    </header>
  );
}
