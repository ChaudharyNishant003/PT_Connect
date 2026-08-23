"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import StudentPicker from "@/components/entries-add/StudentPicker";
import SubjectTabStrip from "@/components/entries-add/SubjectTabStrip";
import TagAndSaveSheet from "@/components/entries-add/TagAndSaveSheet";
import { useAddTodaysWorkFlow, type StudentDTO, type EntryType } from "@/components/entries-add/useAddTodaysWorkFlow";

export default function AddTodaysWorkFlow({
  students,
  initialLoggedKeys,
}: {
  students: StudentDTO[];
  initialLoggedKeys: string[];
}) {
  const t = useTranslations();
  const router = useRouter();
  const flow = useAddTodaysWorkFlow(students, initialLoggedKeys);
  const captureInputRef = useRef<HTMLInputElement>(null);

  function handlePickSubject(subjectName: string) {
    flow.openCaptureFor(subjectName);
    captureInputRef.current?.click();
  }

  async function handleSave(data: { type: EntryType; dueDate: string | null; caption: string | null }) {
    const photoKeys = flow.pendingPhotos.filter((p) => p.status === "done" && p.key).map((p) => p.key!);
    if (!flow.activeSubjectName || photoKeys.length === 0) return;

    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentIds: Array.from(flow.selectedStudentIds),
        subjectName: flow.activeSubjectName,
        type: data.type,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        caption: data.caption ?? undefined,
        photoKeys,
      }),
    });

    if (res.ok) {
      const result = await res.json();
      flow.markSaved(
        flow.activeSubjectName,
        result.entries.map((e: { studentId: string; subjectId: string }) => ({
          studentId: e.studentId,
          subjectId: e.subjectId,
        })),
      );
      router.refresh();
    }
  }

  return (
    <div>
      <input
        ref={captureInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        hidden
        onChange={(e) => {
          flow.onFilesSelected(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />

      {flow.step === "students" && (
        <StudentPicker
          students={flow.students}
          selectedStudentIds={flow.selectedStudentIds}
          onToggle={flow.toggleStudent}
          onContinue={flow.goToSubjects}
        />
      )}

      {flow.step === "subjects" && (
        <SubjectTabStrip
          studentLabel={flow.selectedStudents.map((s) => s.name).join(", ")}
          tabs={flow.subjectTabs}
          onPick={handlePickSubject}
          onBack={flow.backToStudents}
          doneTodayCount={flow.doneTodayCount}
          totalStudents={flow.students.length}
        />
      )}

      {flow.activeSubjectName && (
        <TagAndSaveSheet
          open={flow.sheetOpen}
          subjectName={flow.activeSubjectName}
          photos={flow.pendingPhotos}
          onAddMorePhotos={(files) => flow.onFilesSelected(files)}
          onRemovePhoto={flow.removePendingPhoto}
          onRetryPhoto={flow.retryUpload}
          onClose={flow.closeSheet}
          onSave={handleSave}
        />
      )}

      {flow.subjectTabs.length === 0 && flow.step === "subjects" && (
        <p className="mt-4 text-sm text-gray-500">{t("students.noEntriesYet")}</p>
      )}
    </div>
  );
}
