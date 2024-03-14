import { z } from 'zod';

export const NewProductTypeBodySchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255).optional(),
  image: z.string().ulid(),
});

export const UpdateProductTypeBodySchema = z.object({
  name: z.string().min(3).max(255).optional(),
  description: z.string().min(3).max(255).optional(),
  image: z.string().ulid().optional(),
});

export type UpdateProductTypeBody = z.infer<typeof UpdateProductTypeBodySchema>;

export type NewProductTypeBody = z.infer<typeof NewProductTypeBodySchema>;
