import { z } from "zod";

export const updateOrgSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  contactEmail: z.string().trim().toLowerCase().email().nullish(),
  contactPhone: z.string().trim().max(30).nullish(),
});
