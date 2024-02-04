import { z } from 'zod';

export const praramIdValidator = z.object({
  id: z.string().uuid(),
});
export const queryPageValidator = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
})
