import { z } from 'zod';

export const productQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  category: z.string().optional(),
  search: z.string().optional(),
  shop: z.string().optional(),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
