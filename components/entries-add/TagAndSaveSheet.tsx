"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import BottomSheet from "@/components/ui/BottomSheet";
import Chip from "@/components/ui/Chip";
import Button from "@/components/ui/Button";
import type { EntryType, PendingPhoto } from "@/components/entries-add/useAddTodaysWorkFlow";

const ENTRY_TYPES: EntryType[] = ["CLASSWORK", "HOMEWORK", "TEST", "REVISION"];

export default function TagAndSaveSheet({
  open,
  subjectName,
  photos,
  onAddMorePhotos,
  onRemovePhoto,
  onRetryPhoto,
  onClose,
  onSave,
}: {
  open: boolean;
  subjectName: string;
  photos: PendingPhoto[];
  onAddMorePhotos: (files: File[]) => void;
  onRemovePhoto: (localId: string) => void;
  onRetryPhoto: (localId: string) => void;
  onClose: () => void;
  onSave: (data: { type: EntryType; dueDate: string | null; caption: string | null }) => Promise<void>;
}) {
  const t = useTranslations();
  const [type, setType] = useState<EntryType>("CLASSWORK");
  const [dueDate, setDueDate] = useState("");
  const [caption, setCaption] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const needsDueDate = type === "HOMEWORK" || type === "TEST";
  const doneCount = photos.filter((p) => p.status === "done").length;
  const hasUploading = photos.some((p) => p.status === "uploading");
  const canSave = doneCount > 0 && !hasUploading && !isSaving && (!needsDueDate || dueDate);

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave({ type, dueDate: needsDueDate && dueDate ? dueDate : null, caption: caption || null });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={subjectName}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {photos.map((photo) => (
            <div key={photo.localId} className="relative h-20 w-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.previewUrl}
                alt=""
                className={`h-20 w-20 rounded-lg border border-gray-200 object-cover ${
                  photo.status === "uploading" ? "opacity-50" : ""
                }`}
              />
              {photo.status === "uploading" && (
                <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-600">
                  ...
                </span>
              )}
              {photo.status === "error" && (
                <button
                  type="button"
                  onClick={() => onRetryPhoto(photo.localId)}
                  className="absolute inset-0 flex items-center justify-center rounded-lg bg-red-600/80 text-xs text-white"
                >
                  Retry
                </button>
              )}
              <button
                type="button"
                onClick={() => onRemovePhoto(photo.localId)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-xs text-white"
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-500"
          >
            {t("addWork.addMorePhotos")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            hidden
            onChange={(e) => {
              onAddMorePhotos(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {ENTRY_TYPES.map((entryType) => (
            <Chip key={entryType} active={type === entryType} onClick={() => setType(entryType)}>
              {t(`addWork.entryType.${entryType}`)}
            </Chip>
          ))}
        </div>

        {needsDueDate && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">{t("addWork.dueDate")}</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="min-h-[44px] rounded-lg border border-gray-300 px-3 text-base"
            />
          </div>
        )}

        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={t("addWork.caption")}
          className="min-h-[44px] rounded-lg border border-gray-300 px-3 text-base"
        />

        <Button onClick={handleSave} disabled={!canSave} className="w-full">
          {isSaving ? t("common.loading") : t("addWork.save")}
        </Button>
      </div>
    </BottomSheet>
  );
}
