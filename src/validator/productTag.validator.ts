import { z } from 'zod';

export const CreateProductTagValidator = z.object({
  name: z.string().min(3).max(255),
  description: z.string().optional(),
});

export type CreateProductTagValidatorType = z.infer<
  typeof CreateProductTagValidator
>;
