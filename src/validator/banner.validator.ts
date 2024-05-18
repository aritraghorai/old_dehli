import { z } from 'zod';

export const createBannerValidator = z.object({
  image: z.string().uuid(),
  name: z.string(),
  category: z.string().uuid(),
  position: z.coerce
    .number()
    .positive()
    .optional()
    .transform(val => +val),
});

export type CreateBannerInput = z.infer<typeof createBannerValidator>;
