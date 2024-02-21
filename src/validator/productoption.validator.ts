import { z } from 'zod';

export const ProductOptionValidator = z.object({
  value: z.string(),
});

export type ProductOptionBody = z.infer<typeof ProductOptionValidator>;
