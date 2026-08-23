import { useMemo, useState } from "react";

export interface SubjectDTO {
  id: string;
  name: string;
  sortOrder: number;
}

export interface StudentDTO {
  id: string;
  name: string;
  grade: string | null;
  subjects: SubjectDTO[];
}

export type EntryType = "CLASSWORK" | "HOMEWORK" | "TEST" | "REVISION";

export interface PendingPhoto {
  localId: string;
  file: File;
  previewUrl: string;
  status: "uploading" | "done" | "error";
  key?: string;
}

type Step = "students" | "subjects";

export function useAddTodaysWorkFlow(students: StudentDTO[], initialLoggedKeys: string[]) {
  const [step, setStep] = useState<Step>("students");
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [loggedKeys, setLoggedKeys] = useState<Set<string>>(new Set(initialLoggedKeys));
  const [activeSubjectName, setActiveSubjectName] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);

  const selectedStudents = useMemo(
    () => students.filter((s) => selectedStudentIds.has(s.id)),
    [students, selectedStudentIds],
  );

  const doneTodayCount = useMemo(() => {
    const studentIdsWithEntry = new Set(Array.from(loggedKeys).map((key) => key.split(":")[0]));
    return students.filter((s) => studentIdsWithEntry.has(s.id)).length;
  }, [loggedKeys, students]);

  const subjectTabs = useMemo(() => {
    const nameToMinSort = new Map<string, number>();
    for (const student of selectedStudents) {
      for (const subject of student.subjects) {
        const current = nameToMinSort.get(subject.name);
        if (current === undefined || subject.sortOrder < current) {
          nameToMinSort.set(subject.name, subject.sortOrder);
        }
      }
    }
    const names = Array.from(nameToMinSort.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([name]) => name);

    return names.map((name) => {
      let loggedCount = 0;
      for (const student of selectedStudents) {
        const subject = student.subjects.find((s) => s.name === name);
        if (subject && loggedKeys.has(`${student.id}:${subject.id}`)) loggedCount += 1;
      }
      const status: "none" | "partial" | "full" =
        loggedCount === 0 ? "none" : loggedCount === selectedStudents.length ? "full" : "partial";
      return { name, status };
    });
  }, [selectedStudents, loggedKeys]);

  function toggleStudent(studentId: string) {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  function goToSubjects() {
    if (selectedStudentIds.size > 0) setStep("subjects");
  }

  function backToStudents() {
    setStep("students");
  }

  function openCaptureFor(subjectName: string) {
    setActiveSubjectName(subjectName);
    setPendingPhotos([]);
  }

  async function uploadPhoto(localId: string, file: File) {
    const uploaded = await uploadWithRetry(file);
    setPendingPhotos((prev) =>
      prev.map((p) =>
        p.localId === localId
          ? uploaded
            ? { ...p, status: "done", key: uploaded.key }
            : { ...p, status: "error" }
          : p,
      ),
    );
  }

  function onFilesSelected(files: File[]) {
    if (files.length === 0) return;
    setSheetOpen(true);
    const newPhotos: PendingPhoto[] = files.map((file) => ({
      localId: `${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: "uploading",
    }));
    setPendingPhotos((prev) => [...prev, ...newPhotos]);
    newPhotos.forEach((photo) => uploadPhoto(photo.localId, photo.file));
  }

  function retryUpload(localId: string) {
    setPendingPhotos((prev) => {
      const target = prev.find((p) => p.localId === localId);
      if (target) uploadPhoto(localId, target.file);
      return prev.map((p) => (p.localId === localId ? { ...p, status: "uploading" } : p));
    });
  }

  function removePendingPhoto(localId: string) {
    setPendingPhotos((prev) => prev.filter((p) => p.localId !== localId));
  }

  function closeSheet() {
    setSheetOpen(false);
    setActiveSubjectName(null);
    setPendingPhotos([]);
  }

  function markSaved(subjectName: string, createdEntries: { studentId: string; subjectId: string }[]) {
    setLoggedKeys((prev) => {
      const next = new Set(prev);
      for (const entry of createdEntries) next.add(`${entry.studentId}:${entry.subjectId}`);
      return next;
    });
    closeSheet();
  }

  return {
    step,
    students,
    selectedStudentIds,
    selectedStudents,
    subjectTabs,
    activeSubjectName,
    sheetOpen,
    pendingPhotos,
    doneTodayCount,
    toggleStudent,
    goToSubjects,
    backToStudents,
    openCaptureFor,
    onFilesSelected,
    retryUpload,
    removePendingPhoto,
    closeSheet,
    markSaved,
    setSheetOpen,
  };
}

async function uploadWithRetry(file: File, attempt = 0): Promise<{ key: string } | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/uploads", { method: "POST", body: formData });
    if (!res.ok) throw new Error("upload failed");
    const data = await res.json();
    return { key: data.key };
  } catch {
    if (attempt < 2) return uploadWithRetry(file, attempt + 1);
    return null;
  }
}
