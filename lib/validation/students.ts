import { z } from "zod";

export const PRESET_SUBJECTS = ["Math", "Science", "English", "Hindi", "Social Studies"] as const;

export const createStudentSchema = z.object({
  name: z.string().trim().min(1).max(120),
  grade: z.string().trim().max(60).optional(),
  parentName: z.string().trim().max(120).optional(),
  parentPhone: z.string().trim().max(30).optional(),
  subjects: z.array(z.string().trim().min(1).max(60)).min(1).max(20),
});

export const updateStudentSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  grade: z.string().trim().max(60).nullish(),
  parentName: z.string().trim().max(120).nullish(),
  parentPhone: z.string().trim().max(30).nullish(),
  isArchived: z.boolean().optional(),
});

export const createSubjectSchema = z.object({
  name: z.string().trim().min(1).max(60),
  color: z.string().trim().max(20).optional(),
});

export const updateSubjectSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  color: z.string().trim().max(20).nullish(),
  sortOrder: z.number().int().min(0).optional(),
});

export const reorderSubjectsSchema = z.object({
  order: z.array(z.string().min(1)).min(1),
});
