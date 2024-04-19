import { z } from 'zod';

export const NewCategoryValidator = z.object({
  name: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string().min(3).max(255).optional(),
  parentCategoryId: z.string().uuid().optional(),
});

export const UpdateCategoryValidator = z.object({
  name: z.string().min(3).max(255).optional(),
  slug: z.string().min(3).max(255).optional(),
  description: z.string().min(3).max(255).optional(),
  parentCategoryId: z.string().uuid().optional(),
});

export type UpdateCategoryValidatorType = z.infer<
  typeof UpdateCategoryValidator
>;

export type NewCategoryValidatorType = z.infer<typeof NewCategoryValidator>;
