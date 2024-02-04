import { z } from 'zod';
import { queryPageValidator } from './common.validator.js';

export const shopQuerySchema = z.intersection(
  queryPageValidator,
  z.object({
    search: z.string().optional(),
  }),
);
export type ShopQuery = z.infer<typeof shopQuerySchema>;
