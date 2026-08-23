import { z } from "zod";

export const entryTypeSchema = z.enum(["CLASSWORK", "HOMEWORK", "TEST", "REVISION"]);

export const createEntrySchema = z
  .object({
    studentIds: z.array(z.string().min(1)).min(1).max(50),
    subjectName: z.string().trim().min(1).max(60),
    type: entryTypeSchema.default("CLASSWORK"),
    dueDate: z.string().datetime().optional(),
    caption: z.string().trim().max(500).optional(),
    photoKeys: z.array(z.string().min(1)).min(1).max(10),
  })
  .refine((data) => (data.type === "HOMEWORK" || data.type === "TEST" ? !!data.dueDate : true), {
    message: "dueDate is required for Homework and Test entries",
    path: ["dueDate"],
  });

export const updateEntrySchema = z.object({
  subjectId: z.string().min(1).optional(),
  type: entryTypeSchema.optional(),
  dueDate: z.string().datetime().nullish(),
  caption: z.string().trim().max(500).nullish(),
  addPhotoKeys: z.array(z.string().min(1)).max(10).optional(),
  removePhotoIds: z.array(z.string().min(1)).max(10).optional(),
});

export const listEntriesQuerySchema = z.object({
  studentId: z.string().min(1).optional(),
  subjectId: z.string().min(1).optional(),
  type: entryTypeSchema.optional(),
  cursor: z.string().min(1).optional(),
  take: z.coerce.number().int().min(1).max(100).default(20),
});
