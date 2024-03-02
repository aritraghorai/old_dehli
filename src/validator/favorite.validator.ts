import { z } from 'zod';

export const addToFavoriteValidator = z.object({
  productItemId: z.string().uuid(),
});

export type AddToFavoriteInput = z.infer<typeof addToFavoriteValidator>;
