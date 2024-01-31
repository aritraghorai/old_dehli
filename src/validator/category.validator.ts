import { z } from "zod";

export const NewCategoryValidator = z.object({
  name: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  parentCategoryId: z.string().uuid().optional()
})

export type NewCategoryValidatorType = z.infer<typeof NewCategoryValidator>