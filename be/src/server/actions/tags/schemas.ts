import z from "zod/v4";

export const createTagSchema = z.object({
  tag: z.string().min(3),
});
export const tagFilterSchema = z.object({
  tag: z.coerce.string().optional(),
});
