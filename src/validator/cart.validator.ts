import { z } from 'zod';

export const addToCardBodyValidator = z.object({
  productItemId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export type AddToCartBody = z.infer<typeof addToCardBodyValidator>;
